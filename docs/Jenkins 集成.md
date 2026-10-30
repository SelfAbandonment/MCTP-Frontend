# Jenkins 集成

## 目标结构

| 任务 | 类型 | 脚本 | 触发 |
|---|---|---|---|
| `MCTP-FE` | Multibranch Pipeline | `Jenkinsfile` | push `develop`/`main`、PR |
| `MCTP-FE-Dependency` | Pipeline | `Jenkinsfile.dependency` | 每周一 09:00 |

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
| `SKIP_LIGHTHOUSE` | false | 跳过性能/无障碍检测；PR 构建本身就会跳过 |

## 缓存与产物

- Lighthouse 镜像 `mctp/lighthouse-ci:0.15.1` 首次构建 1–2 分钟，之后命中层缓存
- 产物归档：`dist/**`、`.lighthouseci/**`
- 每个分支保留 20 条构建、10 份产物；新构建会中止同分支进行中的旧构建

## 常见问题

- **`githubNotify` 报错**：凭证类型不对或 token 缺 `repo:status`；流水线只打印日志，不影响结果
- **Lighthouse 找不到容器**：Jenkins 不在容器里时脚本会自动退回 `-v $WORKSPACE:$WORKSPACE`
- **`Nodejs24` 工具不存在**：Jenkins → 系统管理 → 全局工具配置里新增 NodeJS 安装，名字必须是 `Nodejs24`
