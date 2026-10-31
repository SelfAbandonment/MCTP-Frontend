# Jenkins 集成

## 目标结构

| 任务 | 类型 | 脚本 | 触发 |
|---|---|---|---|
| `MCTP-FE` | Multibranch Pipeline | `Jenkinsfile` | push `develop`/`main`、PR |
| `MCTP-FE-Dependency` | Pipeline | `Jenkinsfile.dependency` | 每周一 09:00、手动 |
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
| `FORCE_LIGHTHOUSE` | false | 在 PR 或功能分支上强制运行 Lighthouse（默认只在 `develop`/`main` 跑） |

## 缓存与产物

- Lighthouse 镜像 `mctp/lighthouse-ci:0.15.1` 首次构建 1–2 分钟，之后命中层缓存
- Lighthouse 只在 `develop`/`main` 运行；PR 构建默认跳过（太慢），需要时用 `FORCE_LIGHTHOUSE` 手动触发
- 产物归档：`dist/index.html`、`dist/assets/**`、`.lighthouseci/**`（不再归档十几 MB 的 `dist/media/**`）
- 每个分支保留 20 条构建、3 份产物；新构建会中止同分支进行中的旧构建
- PR 构建结束后自动 `cleanWs()`，避免 `node_modules`/`dist` 占满执行器磁盘
- `npm audit` 已移到 `MCTP-FE-Dependency` 每周巡检，主流水线不再因依赖告警变红

## 生产部署

- GitHub Pages 的 `deploy.yml` 只负责 `main` 前端预览
- 生产由 `MCTP-Deploy` 负责：`MCTP-FE` 或 `MCTP-API-CI` 的 `main` 构建成功后自动触发，参数 `BRANCH=main`
- `MCTP-Deploy` 只接受 `main`（`precheck` 阶段会拒绝其他分支），并发构建改为排队而不是中止

## 常见问题

- **`githubNotify` 报错**：凭证类型不对或 token 缺 `repo:status`；流水线只打印日志，不影响结果
- **Lighthouse 找不到容器**：Jenkins 不在容器里时脚本会自动退回 `-v $WORKSPACE:$WORKSPACE`
- **`Nodejs24` 工具不存在**：Jenkins → 系统管理 → 全局工具配置里新增 NodeJS 安装，名字必须是 `Nodejs24`
