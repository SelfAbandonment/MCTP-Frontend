# MCTP Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/GSAP-3.x-88CE02" alt="GSAP" />
  <img src="https://img.shields.io/github/actions/workflow/status/SelfAbandonment/MCTP-Frontend/deploy.yml?label=deploy&logo=github" alt="Deploy Status" />
  <img src="https://img.shields.io/github/actions/workflow/status/SelfAbandonment/MCTP-Frontend/ci.yml?label=ci&logo=github" alt="CI Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
</p>

MCTP / 方块社区前端，基于 Vue 3 + Vite 构建：Minecraft 主题的电影感社区官网、玩家中心和独立管理区。

## 在线访问

| 地址 | 说明 |
|------|------|
| [Frontend](https://selfabandonment.github.io/MCTP-Frontend/) | GitHub Pages 部署 |
| [Backend API](http://api.mcreatopla.top:21009) | Django REST Framework |
| [Swagger UI](http://api.mcreatopla.top:21009/api/docs/) | 交互式 API 文档 |
| [OpenAPI Schema](http://api.mcreatopla.top:21009/api/schema/) | OpenAPI 3.0 Schema |

## 功能

- 电影感首页：全屏 Minecraft 光影影像 + 滚动驱动的 clip-path 镜头框 + 四个可切换世界画面（湖畔 / 原野 / 远山 / 月夜）
- 滚动叙事：GSAP + ScrollTrigger 驱动——Hero 收帧、About 图窗从圆角小窗钉住展开为全屏、Features Bento 网格（静态大图、3D 倾斜、径向 hover）、Story 多边形裁切大图 + 视差、Contact 夹缝图片
- 全站中文：页面可见文案不出现英文（品牌 MCTP 除外），首页中文克制、以画面为主
- 玩家中心：注册登录、邮箱编辑、修改密码、Microsoft / Minecraft 绑定与解绑
- 管理区：公告创建、编辑、草稿、定时发布和删除；玩家搜索、绑定信息、停用与恢复账号
- API 健康检查（每 30 秒刷新，后台页面不自动轮询；不是游戏服务器状态）
- 管理路由在读取当前用户后检查角色；接口仍以服务端权限为准
- 动效遵循 `prefers-reduced-motion`：减少动态时取消滚动钉住、视差与自动播放
- 视频离屏自动暂停；WebGL 已不再用于页面渲染（three.js 仅保留给旧单元测试）

## 视觉与素材

首页采用暗色影院风格：近黑底、羊皮纸白文字、草绿主色，超大字重中文标题使用自托管的 **得意黑 Smiley Sans**（OFL，按站点用字子集化，约 88KB），排版与滚动叙事参考 Awwwards 风格站点（如 zentry 克隆）的结构，但**没有**使用 zentry 的视频/图片/字体。

- `src/components/film/FilmHero.vue`：Hero（真实视频切换、clip-path 收帧、载入动画、图标暂停/向下）。
- `src/components/film/FilmAbout.vue`：About（ScrollTrigger pin + scrub 图窗展开）。
- `src/components/film/FilmFeatures.vue`：Features（Bento 网格、服务器实录微动视频 + hover 微动 + 绿色「更多」卡）。
- `src/components/film/FilmStory.vue`：Story（多边形裁切大图 + 3D 倾斜 + 视差）。
- `src/components/film/FilmContact.vue`：Contact（夹缝图片 + 入服/玩家中心入口）。
- `src/components/film/FilmVideo.vue`、`FilmTilt.vue`、`FilmBentoCard.vue`、`FilmLoader.vue`：视频宿主、3D 倾斜、Bento 卡片、载入遮罩。
- `src/components/cinematic/`：AnimatedTitle（中文逐字 3D 翻入）、CinematicButton。
- `src/animations/motion.js`：GSAP + ScrollTrigger 注册与 Vue 生命周期封装。
- `src/assets/cinematic.css`、`src/style.css`：电影感样式层与全站暗色 tokens。
- `src/assets/media.js`：所有媒体的唯一入口（视频、海报、大图）。
- `src/assets/fonts/`：得意黑子集（`scripts/subset-font.py` 可重新生成）。

### 素材来源与替换

- **Hero / Features 视频**：站长提供的服务器实录原片 `37521002344-1-192.mp4`（1280×720 / 110s / 未剪辑）。制作时用 ffmpeg 裁掉游戏 HUD 与右上角水印、统一调色，切成 4 段 Hero 循环（5–8 秒）+ 5 段 Features 微动循环（3.5 秒），均无音轨。
- **About / Story / Contact 图片**：取自 [Modrinth](https://modrinth.com/) 上公开的 Minecraft 光影作品展示图（Complementary / Photon / Bliss / Solas / Kappa 等 shader pack 项目画廊），仅用于本非商业社区站点的视觉演示。

正式发布前如需更高画质，建议重新录制：`F1` 隐藏 HUD、2560×1440 / 60fps、相机移动放慢、避免打开背包；录好后放到工作区，我可以按同一流程重剪。

- `public/media/hero/`：首页 4 段服务器实录循环视频；`public/media/features/`：Features 5 段 3.5 秒微动循环；`public/media/posters/`：视频首帧海报。
- `public/media/img/`：About、Story、Contact 使用的大图。
- 替换素材时保持 `src/assets/media.js` 里的路径与文件名不变即可；Hero 视频建议 1600×900 / H.264 / 无音轨 / 5–8 秒循环。

## 场景与验收脚本

- `scripts/cdp-capture.mjs`：通过 Chrome DevTools Protocol 驱动本机 Edge 无头截图，支持滚动位置、`CDP_REDUCED=1` 模拟减少动态、`CDP_EVAL` 执行交互、`CDP_PORT` 指定端口。
- `scripts/qa-screenshots.ps1`：整站多断点截图（Windows PowerShell）。
- `scripts/subset-font.py`：扫描 `src/` 中出现的中文字符并重新子集化得意黑字体。

## 接口与权限

| 页面/功能 | API |
| --- | --- |
| 公告（无需登录，不发送账号令牌） | `GET /api/v1/announcements/` |
| 管理公告 | `GET/POST /api/v1/manage/announcements/`、`GET/PATCH/DELETE /api/v1/manage/announcements/{id}/` |
| 管理玩家 | `GET /api/v1/manage/players/?search=&page=`、`GET/PATCH /api/v1/manage/players/{id}/` |
| 登录 / 注册 / 微软登录 | allauth headless：`/_allauth/browser/v1/auth/login|signup|session`、`/_allauth/browser/v1/auth/provider/redirect` |
| 会话换 JWT | `POST /api/v1/auth/token/session/`（登录/注册/微软回调完成后由前端调用） |
| 玩家资料 | `GET/PUT /api/v1/auth/me/` |
| 修改密码 | `POST /api/v1/auth/password/` |
| 解绑微软/Minecraft | `DELETE /api/v1/auth/microsoft/unbind/` |

列表响应为 `{code, message, data: {results, count, next, previous}}`；具体以配套后端 OpenAPI 为准。
公告仅使用纯文本渲染，不解释 HTML。公开列表排除草稿与尚未到发布时间的公告。
管理员只能停用或恢复普通玩家；不能修改自己、其他管理员或超级用户，也不提供删除账号和角色提升。
这些限制同时由后端执行，不依赖按钮是否可见。

会话恢复失败会显示可重试页面；临时网络错误不会清除登录凭据。
并发刷新共用一次请求，并保存轮换后的 refresh token。密码更新后要求重新登录。

认证由后端的 **django-allauth** 接管：密码登录、注册、微软/Minecraft 登录都走 allauth headless；
成功后前端用 `POST /api/v1/auth/token/session/` 把 Django session 换成 SimpleJWT，后续接口继续用 Bearer Token。
微软登录使用 allauth 的自定义 provider（`/accounts/microsoft/login/callback/`），不再把 token 拼进前端 URL。
本地联调时前端与 API 请使用同一 host（都 `localhost` 或都 `127.0.0.1`），否则 session/CSRF cookie 不共享。

## 本地开发

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 启动步骤

```bash
# 克隆仓库
git clone https://github.com/SelfAbandonment/MCTP-Frontend.git
cd MCTP-Frontend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local
# 按需修改 .env.local 中的 VITE_API_BASE_URL

# 启动开发服务器
npm run dev
```

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产包 |
| `npm run preview` | 预览生产构建 |
| `npm test` | 会话刷新、错误处理与旧几何逻辑单元测试 |
| `npm run lint` | 运行 ESLint 并自动修复 |
| `npm run lint:check` | 运行 ESLint 检查（不修复） |

### 目录结构

```
MCTP-Frontend/
├── .github/                  # Issue/PR 模板与 CI
├── archive/                  # 历史实验组件与旧素材（不参与构建）
├── docs/                     # 设计与协作规范
├── public/
│   ├── media/                # 视频、海报、大图（见「素材来源与替换」）
│   └── favicon.svg
├── scripts/                  # CDP 截图、字体子集等开发脚本
├── src/
│   ├── animations/           # GSAP 动效封装
│   ├── assets/               # 字体、全局样式、媒体常量
│   ├── components/
│   │   ├── cinematic/        # AnimatedTitle / CinematicButton
│   │   ├── film/             # 首页五个电影感段落 + 共享视频组件
│   │   └── layout/           # SiteHeader / SiteFooter
│   ├── composables/          # 分页、社区风景（旧测试用）等
│   ├── router/               # 路由与权限守卫
│   ├── stores/               # Pinia 状态
│   ├── utils/                # 错误处理等
│   ├── views/                # 页面
│   ├── App.vue
│   └── main.js
├── tests/                    # node:test 单元测试
├── .env.example
├── eslint.config.js
├── vite.config.js
└── package.json
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `http://api.mcreatopla.top:21009` |

## 部署

- **预览**：push `main` 自动构建并发布到 GitHub Pages（`https://selfabandonment.github.io/MCTP-Frontend/`）。
- **PR 预览**：每个同仓库 PR 会部署到 `preview/pr-<编号>/`，并在 PR 评论里给出链接；PR 关闭后自动清理。
- **生产**：由 Jenkins `MCTP-Deploy` 在 `main` 构建成功后自动部署，GitHub Pages 只作预览入口。
- 必须先设置仓库 Actions variable `VITE_API_BASE_URL` 为实际 **HTTPS** 后端地址；工作流会拒绝空值或 HTTP 地址。
- 当前文档中的 HTTP API 可用于 HTTP 本地开发，但不能直接供 HTTPS GitHub Pages 调用。
- 正式发布前还需先部署后端迁移、校验 CORS 与 Microsoft 回调配置，然后再发布前端。

## 贡献

1. Fork 本仓库
2. 基于 `develop` 创建 feature 分支：`git checkout -b feat/your-feature`
3. Commit 变更（遵循 [Conventional Commits](https://www.conventionalcommits.org/)）
4. Push 并发起 Pull Request

## 相关仓库

- 后端：[SelfAbandonment/MCTP-API](https://github.com/SelfAbandonment/MCTP-API)

## License

[MIT](./LICENSE)
