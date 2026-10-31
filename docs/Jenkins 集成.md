# Jenkins 集成

## 目标结构

| 任务 | 类型 | 脚本 | 触发 |
|---|---|---|---|
| `MCTP-FE` | Multibranch Pipeline | `Jenkinsfile` | push `develop`/`main`、PR |
| `MCTP-FE-Dependency` | Pipeline | `Jenkinsfile.dependency` | 每周一 09:00、手动（前端 audit + 后端 pip-audit） |
| `MCTP-Deploy` | Pipeline | 内联脚本（Jenkins 任务配置） | `main` 构建成功后自动触发 |

现有的 `MCTP-Dependency-Health` 改成 `MCTP-FE-Dependency`（Script Path 指向 `Jenkinsfile.dependency`），不要再让它跑全量流水线。

## 建任务

1. New Item → **Multibranch Pipeline**，名字 `MCTP-FE`
2. Branch Sources → GitHub：
   - Repository URL：`https://github.com/SelfAbandonment/MCTP-Frontend.git`
   - Credentials：`github-MCTP`
3. Behaviors：
   - Discover branches，Filter by name：`develop main`
   - Discover pull requests from origin，Strategy：Merging the pull request with the current target branch revision
4. Build Configuration → Script Path：`Jenkinsfile`
5. Scan 触发器：Periodically if not otherwise run → 5 分钟
6. 保存后执行一次 **Scan Repository Now**

## Webhook

GitHub 仓库 → Settings → Webhooks → Add webhook：

- Payload URL：`http://3.25.210.191:10086/github-webhook/`
- Content type：`application/json`
- Events：Pushes、Pull requests

## 状态回写

GitHub Branch Source 会为每个分支和 PR 自动回写两个 status：`continuous-integration/jenkins/branch` 和 `continuous-integration/jenkins/pr-merge`，不需要额外配置。

注意：这个版本的 `github` 插件没有 `githubNotify` 步骤，脚本里调用会直接报 `NoSuchMethodError`，所以流水线不再自己回写状态，依赖上面的自动 status。

## 参数

| 参数 | 默认 | 说明 |
|---|---|---|
| `SKIP_LIGHTHOUSE` | false | 跳过性能/无障碍检测 |
| `FORCE_LIGHTHOUSE` | false | 在非 PR 的功能分支上强制运行 Lighthouse（PR 与 `develop`/`main` 默认都会跑） |
| `LIGHTHOUSE_STRICT` | false | Lighthouse 有 warning 时把构建标记为 UNSTABLE（默认只写描述/评论，不阻塞） |

## 缓存与产物

- Lighthouse 镜像 `mctp/lighthouse-ci:0.15.1` 首次构建 1–2 分钟，之后命中层缓存
- Lighthouse 在 `develop`/`main`，以及包含 `src/**`、`public/**`、依赖/构建配置变更的 PR 上运行；纯文档 PR 自动跳过
- 评分与断言摘要写入构建描述；PR 上新增/更新 **Lighthouse 评论**（`<!-- mctp-lighthouse -->`，`scripts/pr-comment.mjs` 的 `REPORT_KIND=lighthouse` 模式）
- Lighthouse 有 warning 时默认只写构建描述/评论；`LIGHTHOUSE_STRICT=true` 才把构建标记为 **UNSTABLE**
- 测试/覆盖率与 CI 汇总评论由 GitHub Actions 负责（见下方分工），Jenkins 不再跑 ESLint/单测
- 产物归档：`dist/index.html`、`dist/assets/**`、`.lighthouseci/**`（不再归档十几 MB 的 `dist/media/**`）
- 每个分支保留 10 条构建、2 份产物；新构建会中止同分支进行中的旧构建
- PR 构建结束后自动 `cleanWs()`，避免 `node_modules`/`dist` 占满执行器磁盘
- `npm audit` 已移到 `MCTP-FE-Dependency` 每周巡检，主流水线不再因依赖告警变红；巡检任务同时用 `uv export` + `pip-audit` 审计后端依赖
- 覆盖率由 GitHub Actions 的 `test` job 执行（`scripts/coverage-gate.mjs`，下限 **70%**，低于阈值必需检查失败）
- checkout 使用 `skipDefaultCheckout` + 显式 `checkout scm`（`retry(2)`）；PR 构建先 `deleteDir()`，避免旧工作区造成空目录
- Node 版本统一为 **24**（Jenkins `Nodejs24`、GitHub Actions、`engines >=24`、`.nvmrc`）

## 与 GitHub Actions 的分工

- **GitHub Actions（分支保护必需检查）**：`lint`、`test`（JUnit + 覆盖率门禁 70%）、`build`；PR 上回写 CI 汇总评论（测试/覆盖率）；PR 预览复用 `build` 的 `dist` artifact 部署；`main` 部署 Pages。
- **Jenkins**：FE 只做 `build + Lighthouse`（评论 `<!-- mctp-lighthouse -->`），`main` 通过后触发 `MCTP-Deploy`；不再重复 ESLint/单测/覆盖率。
- 契约检查由 API 的 Jenkins 负责；预览与源站共用一份 `dist`（`vite base` 改为相对路径），gh-pages 每月初自动压缩历史。

## 依赖巡检 Issue

- `MCTP-FE-Dependency` 在巡检结束后调用 `scripts/security-issue.mjs`：
  - 前端 `npm audit` 有漏洞 → 在 MCTP-Frontend 新建/更新 `[安全巡检] 前端依赖漏洞（N 项）`
  - 后端 `pip-audit` 有漏洞 → 在 MCTP-API 新建/更新 `[安全巡检] 后端依赖漏洞（N 项）`
  - 漏洞清零 → 自动关闭对应旧 Issue
- Issue 用 HTML 标记区分前端/后端，重复巡检只更新同一条；失败不影响巡检构建结果
- 依赖 PR 评论与巡检 Issue 都使用 Jenkins 凭证 `github-MCTP`（需要 Issues 写权限），PR 评论只在 `CHANGE_ID` 存在时执行，所以协作者在仓库内分支提的 PR 同样会收到汇总

## 磁盘治理

- 多分支孤儿策略：`pruneDeadBranches=true`、`daysToKeep=0`、`numToKeep=0`，已关闭 PR / 已删除分支的任务在下次扫描时立即删除
- `MCTP-Cleanup`（每周六 04:00，可手动）：报告 `df`、workspace、jobs 占用；按 GitHub 开放 PR 列表删除已关闭 PR 的工作区；删除 7 天未更新的旧工作区（保留 `*_develop`/`*_main`）；清理 `/tmp/mctp-contract-base-*`、dangling 镜像与 7 天前的 builder 缓存
- Jenkinsfile 构建保留：10 条构建 / 2 份产物

## 生产部署

- GitHub Pages 的 `deploy.yml` 只负责 `main` 前端预览
- 生产由 `MCTP-Deploy` 负责：`MCTP-FE` 或 `MCTP-API-CI` 的 `main` 构建成功后自动触发，参数 `BRANCH=main`
- `MCTP-Deploy` 只接受 `main`（`precheck` 阶段会拒绝其他分支），并发构建改为排队而不是中止

## 常见问题

- **`githubNotify` 报错**：凭证类型不对或 token 缺 `repo:status`；流水线只打印日志，不影响结果
- **Lighthouse 找不到容器**：Jenkins 不在容器里时脚本会自动退回 `-v $WORKSPACE:$WORKSPACE`
- **`Nodejs24` 工具不存在**：Jenkins → 系统管理 → 全局工具配置里新增 NodeJS 安装，名字必须是 `Nodejs24`
