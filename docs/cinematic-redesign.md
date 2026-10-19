# MCREATOPIA 电影感改版 v2 · 视觉与协作规范

> 目标：把 zentry 开源克隆（React + GSAP + Tailwind）的**视觉语言与滚动叙事**完整移植到本项目，同时保持 **Vue 3 + Vite** 技术栈。
> 本版根据反馈重做：**弃用程序化 3D 场景**，改用高质感视频/图片素材；**页面不出现英文**；**中文克制**，以视觉为主。

## 0. 硬性规则

1. **页面不出现英文**（品牌 `MCTP` 除外）。包括：标题、正文、按钮、标签、alt、aria-label、水印、页脚、装饰性大写字母、`01 / SURVIVE` 这类混排。数字和箭头符号可以保留。
2. **中文克制**：首页每段最多 1 行短句（≤14 字）+ 2–4 字标题；不要长段落、不要说明文、不要英文小标签。内页只保留业务必需文案。
3. **视觉为主**：视频/大图/超大中文标题承担叙事；动效与构图参考 zentry。
4. 不引入 React / Tailwind；允许 GSAP（已安装）。
5. 素材使用 `public/media/` 下的视频与图片（来自参考仓库，仅作演示；README 已注明上线前需替换或取得授权）。
6. 所有动效必须尊重 `prefers-reduced-motion`；视频在离屏时暂停。

## 1. 素材（`src/assets/media.js`）

- **Hero / Features 视频**：站长提供的服务器实录原片 `37521002344-1-192.mp4`（1280×720 / 110s），用 ffmpeg 裁掉 HUD 与水印、调色后切成 4 段 Hero 循环 + 5 段 Features 微动循环（均无音轨）。
- **About / Story / Contact 图片**：来自 [Modrinth](https://modrinth.com/) 上公开的 Minecraft 光影 shader pack 项目画廊，仅用于本非商业社区站点的视觉演示。

| 键 | 内容 |
| --- | --- |
| `media.hero` | 4 组 `{ video, poster, name }`，name 为「湖畔 / 村庄 / 远山 / 月夜」 |
| `media.features` | 5 组 `{ image, title, cta }`，title 为「原野 / 建造 / 远行 / 花林 / 深海」（静态图 + hover 微动） |
| `media.about` | 大图（About 钉住展开用，樱花山谷） |
| `media.entrance` | 大图（Story 裁切图用，洞穴光束） |
| `media.contact.one/two/three` | Contact 夹缝图片 |

Hero 视频已转成 1600×900 / H.264 / CRF24 / 无音轨循环，`public/media` 合计约 11MB。所有路径通过 `media.js` 的 `asset()` 生成，勿手写 `/media/...`。

## 2. 字体

- 展示字体：`Smiley Sans`（得意黑，OFL），自托管子集 `src/assets/fonts/smiley-sans.woff2`，CS 变量 `--font-display`。
- 正文字体：系统中文字体栈（`--font-sans`）。
- 新增中文文案后需要重跑 `python scripts/subset-font.py`（脚本会扫描 src 中出现的字符并重新子集化）。

## 3. 首页结构（`src/views/HomeView.vue`）

1. `FilmHero`（已完成）：4 段真实视频 + 滚动 clip-path 镜头框 + 超大标题「方块之间 / 自有天地」+ 编号切景 + 图标暂停/向下 + 载入动画（无浮层预览卡）。
2. `FilmAbout`：中文大标题 + 一行短句；图窗 ScrollTrigger pin + scrub 从居中圆角小窗展开到全屏（`media.about`）。
3. `FilmFeatures`：Bento 网格，`media.features` 5 张服务器实录微动视频卡片 + 1 张品牌绿纯色卡「更多」；3D 倾斜 + hover 微动 + 跟随鼠标的径向渐变 CTA。
4. `FilmStory`：`media.entrance` 放在 zentry 式多边形裁切容器里（`.story-img-mask`），可 3D 倾斜；标题 + 一行短句 + 按钮「阅读」。
5. `FilmContact`：圆角深色面板 + 两侧 clip-path 图片（`media.contact`）+ 中文大标题 + 2 个按钮。
6. 页脚/导航（已完成）：全中文，绿色跑马灯页脚。

## 4. 共享组件

| 组件 | 用法 |
| --- | --- |
| `film/FilmVideo.vue` | 视频宿主：离屏自动暂停、reduced-motion 下不自动播放；props `src/poster/paused/eager/label` |
| `film/FilmTilt.vue` | 3D 倾斜容器，`<FilmTilt :max="6"><slot/></FilmTilt>` |
| `film/FilmBentoCard.vue` | Bento 卡片：`item` 支持 `image`（静态图）或 `video`；props `to`/`href`/`external`/`soon`/`big` |
| `cinematic/AnimatedTitle.vue` | 中文逐字 3D 翻入，`title` 支持 `<br />` 分行；`as/align/stagger` |
| `cinematic/CinematicButton.vue` | 胶囊按钮，`title/to/href/variant(lime|bone|ghost)/icon/external` |
| `film/FilmLoader.vue` | 载入遮罩（Hero 已用） |

## 5. 共享样式（`src/assets/cinematic.css`，全局引入）

`.film`、`.film-section`、`.film-container`、`.display`、`.display--xl/lg/md`、`.film-line`、`.film-mark`、`.cine-btn*`、`.film-grain`、`.story-img-container/mask/content`、`.contact-clip-path-1/2`、`.sword-man-clip-path`、`.mask-clip-path`。

## 6. 动效规范（对齐 zentry）

- ScrollTrigger：`useMotionContext(rootRef, ({ gsap, ScrollTrigger, reduced }) => { ... })`，组件卸载自动清理。
- About：桌面 `pin` + `scrub`，`(max-width: 899px), (prefers-reduced-motion: reduce)` 退化为静态大图。
- Features/Story/Contact：滚动进入淡入上移（`y: 32, opacity: 0 → 1, stagger`），图片/卡片 pointer tilt。
- 所有大标题用 `AnimatedTitle` 或 `.display` + 中文文案。

## 7. 文件归属

| 角色 | 文件 |
| --- | --- |
| Lead | `package.json`、`index.html`、`src/main.js`、`src/App.vue`、`src/router/**`、`src/style.css`、`src/assets/**`、`src/animations/**`、`src/components/layout/**`、`src/components/cinematic/**`、`src/components/film/FilmHero.vue`、`FilmVideo.vue`、`FilmLoader.vue`、`FilmTilt.vue`、`FilmBentoCard.vue`、`src/views/HomeView.vue`、`public/media/**` |
| 首页段落 A | `src/components/film/FilmAbout.vue`、`FilmFeatures.vue` |
| 首页段落 B | `src/components/film/FilmStory.vue`、`FilmContact.vue` |
| 内页去英文 | `src/views/LoginView.vue`、`RegisterView.vue`、`AnnouncementsView.vue`、`DashboardView.vue`、`ManageAnnouncementsView.vue`、`ManagePlayersView.vue`、`RouteStatusView.vue`、`MicrosoftCallbackView.vue`、`src/components/AuthLayout.vue`、`AnnouncementFeed.vue`、`ManagementHeading.vue`、`PaginationControls.vue` |

不要修改不属于自己的文件。需要共享能力时找 Lead。

## 8. 验收

- `npm run lint:check` 0 error、`npm test` 15/15、`npm run build` 成功。
- 桌面 1440×900 与手机 390×844 截图：Hero 视频与滚动收帧、About 展开、Features 网格、Story 裁切图、Contact 面板、页脚全部正常；无横向滚动。
- 全站页面文本扫描：除 `MCTP` 外无英文单词/大写英文标签。
- reduced-motion：无 pin/scrub、视频不自动播放、内容不透明丢失。
