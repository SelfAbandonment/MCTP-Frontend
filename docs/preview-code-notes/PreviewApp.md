---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_1443206bd50211f1a0da525400393706
    ReservedCode1: 0TVNFYheuCYR1/F1oFqhBrecZ2CCQQYI58WFOv6oFB3F4wCTW645vtTShMjFiCLW+RCnw5Vacvm9h8XxAHigyOaQNlZsMUcSuuUQL9aXvfre+hHnmCB2VpASmWrHlYkzpSJ6sl0rTZvS3K9xy7jW9ajm7Ep0aanoz01MxGlXk69LpN43FmEyaeuEOaM=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_1443206bd50211f1a0da525400393706
    ReservedCode2: 0TVNFYheuCYR1/F1oFqhBrecZ2CCQQYI58WFOv6oFB3F4wCTW645vtTShMjFiCLW+RCnw5Vacvm9h8XxAHigyOaQNlZsMUcSuuUQL9aXvfre+hHnmCB2VpASmWrHlYkzpSJ6sl0rTZvS3K9xy7jW9ajm7Ep0aanoz01MxGlXk69LpN43FmEyaeuEOaM=
---





# PreviewApp.vue 说明

## 文件路径
`src/preview/PreviewApp.vue`

## 文件用途
预览页根组件：串联「启动遮罩（IntroAnimation）→ 主界面（顶部导航 + 公告区 + 玩法介绍 + 下载区 + 功能模块 A~H + footer）」，并负责初始化主题。
启动遮罩上滑退场后，主界面壳层 `.preview-shell` 播放「从下方轻微上移 + 淡入」入场动画，形成上下衔接的进入效果。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `import '@/preview/styles/theme.css'` / `base.css` | 预览页主题变量与基础样式为独立 CSS 文件，需在此显式引入才会被 Vite 打包生效。 |
| `import GearBackground` | 引入机械工业动态背景组件，铺在所有内容之下。 |
| `const introDone = ref(false)` | 控制启动遮罩是否显示；遮罩上滑完成（finish）或跳过后置为 true 进入主界面。 |
| `import '@fontsource/pixelify-sans/400.css'` / `700.css`、`import '@fontsource/vt323/400.css'` | 本地自托管像素字体（SIL OFL 1.1 可商用），字体文件随构建产物部署，国内与断网环境都能显示。400 用于正文，700 用于默认加粗的标题；VT323 为备选只有 400。中文字符两款字体都不含，自动回退到 Microsoft YaHei。写在 PreviewApp 而不是 main.js，保证字体只随预览页懒加载包下载。 |
| `themeStore.initTheme()` | 组件 setup 阶段初始化主题（读 localStorage / 默认黑夜），保证首帧即为正确主题。 |
| `onBeforeUnmount(() => themeStore.clearTheme())` | 路由离开预览页时清除 `html[data-theme]`，现有页面不受影响。 |
| `<GearBackground />` | 固定全屏机械工业动态背景（齿轮 + 网格 + 粒子），营造纵深氛围；启动遮罩滑出时可见。 |
| `v-if="!introDone"` → `<IntroAnimation @finish="introDone = true" />` | 启动遮罩存在期间只渲染动画；finish 事件切到主界面（v-if / v-else 互斥切换）。 |
| `<PreviewHeader v-if="introDone" />`（放在 `.preview-root` 下、`.preview-shell` 外） | 固定顶部导航：移出壳层保证 `position: fixed` 直接相对视口、真正置顶；`v-if` 控制在 intro 期间不出现；挂载时播放淡入动画衔接 intro 退场。 |
| `v-else` → `.preview-shell`（`id="preview-top"`） | 主界面内容壳层，用 `position:relative + z-index:1` 抬到背景层之上；`id` 供品牌按钮返回顶部。 |
| `.preview-shell { animation: preview-shell-enter 0.6s ease-out both }` | 主界面壳层入场动画：从下方轻微上移 + 淡入；与 IntroAnimation 遮罩上滑（0.55s）上下衔接——遮罩向上滑出完成瞬间，主界面从下方淡入上移。 |
| `@keyframes preview-shell-enter`（`from { opacity:0; transform: translateY(28px) }` → `to { opacity:1; transform: translateY(0) }`） | 入场动画关键帧：0.6s、`ease-out`、`both` 填充模式保证首帧即隐藏、结束停在最终态。 |
| `PreviewHeader` / `main.preview-main` / `PreviewFooter` | 主界面骨架：顶部导航 + 第一屏（公告区）+ 玩法/下载/功能模块 + footer。 |
| `<AnnouncementSection />` | 第一屏内容：公告区，占满整行。广告区已按需求暂时移除，组件文件 `AdBannerSection.vue` 保留，恢复方法见模板注释。 |
| `<FeatureShowcaseSection />` | 玩法介绍区。 |
| `<DownloadSection />` | 下载区。 |
| `<StatusBarSection />` 等 6 个功能组件 | 功能模块区：状态条（A）/ 在线时长排行（B）/ 规则FAQ（E）/ 活动时间线（F）/ 玩家留言（G）/ STAFF（H），依次编排在 main 内。皮肤预览（C）已按需求暂时取消，组件文件 `SkinPreviewSection.vue` 保留。 |
| `.preview-shell { padding-top: calc(72px + env(safe-area-inset-top)) }` | 为 fixed 顶栏预留高度（含刘海屏安全区）；顶部留白只在这里算一次。 |

## 过渡衔接说明
1. IntroAnimation 遮罩上滑（GSAP `yPercent: -100`、0.55s、`power2.inOut`），滑出动画 `onComplete` 后再 `emit('finish')`。
2. PreviewApp 收到 `finish` → `introDone = true` → `v-if` 卸载 IntroAnimation、`v-else` 挂载 `.preview-shell`。
3. `.preview-shell` 首次挂载即播放 CSS 入场动画（0.6s，从下方上移 + 淡入），与遮罩上滑形成上下连贯进入效果。
4. 切换时机无重叠：遮罩完全滑出后才卸载，主界面从下方进入时启动遮罩已消失，不会同屏闪烁。

## TODO 备注清单
- `TODO-ASSET: 各区块图片/视频素材待补（当前用占位符 + 中文备注）`
- 各功能模块内 TODO-BACKEND / TODO-CONTENT 详见对应组件说明文档