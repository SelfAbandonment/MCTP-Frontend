---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_702f6190d4c111f180d5525400248c00
    ReservedCode1: BDEpo1TkxAD/A/062O71DdiYnB+6qi43cSA/oB883mGYC/1pUPT69X5am5aINeOlmzLWYxCrYhg+38llvIlBmX/6IUdXnfW/gCSRQ65VgWn6zerogWqCz3tw0eVy1h0eB0937JjEuOXNq2oeCY2YVpRYxdTJT34XvV7WOxkllOhGfvoyFPNMpw9dqxk=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_702f6190d4c111f180d5525400248c00
    ReservedCode2: BDEpo1TkxAD/A/062O71DdiYnB+6qi43cSA/oB883mGYC/1pUPT69X5am5aINeOlmzLWYxCrYhg+38llvIlBmX/6IUdXnfW/gCSRQ65VgWn6zerogWqCz3tw0eVy1h0eB0937JjEuOXNq2oeCY2YVpRYxdTJT34XvV7WOxkllOhGfvoyFPNMpw9dqxk=
---




# IntroAnimation.vue 说明（精简版：仅加载遮罩 → 上滑过渡）

## 文件路径
`src/preview/components/IntroAnimation.vue`

## 文件用途
预览页启动遮罩组件（精简版）：启动时全屏显示**加载遮罩**（极细进度条 + 百分比 + monospace 终端日志 + 「点击任意位置开始」提示）；
点击遮罩后**整体向上滑出退场**（GSAP `yPercent: -100`、约 0.55s、`power2.inOut`），滑出动画 `onComplete` 后再向父组件发出 `finish` 事件，
父组件（PreviewApp）随即切换主界面，由 `.preview-shell` 的「从下方轻微上移 + 淡入」（0.6s）衔接，形成「上滑 + 上移」的上下连贯进入效果。

本次改造删除了三段式版本中的**阶段2/3 展示页**（双齿轮主视觉、眉题、拆字主标题、副文案、SCROLL DOWN CTA、底部压暗渐变），
启动页只保留加载遮罩 + 过渡退场。配色沿用预览页主题变量（`--preview-bg` / `--preview-accent` / `--preview-text` 等，三套变量名一致）；动画使用项目已有 GSAP。

## 回退方式
本组件由 `IntroAnimation.three-stage.vue`（三段式：加载遮罩 → 点击触发 → 拆字入场稳定首屏）精简而来，同目录保留备份。
- **回退三段式**：将 `IntroAnimation.three-stage.vue` 复制覆盖 `IntroAnimation.vue` 即可（两者均通过 `emit('finish')` 通知 PreviewApp 切换主界面，接口兼容）。
- **回退旧双齿轮版**：`IntroAnimation.original.vue`（更早的「双齿轮啮合对转 + 标题浮现 + 进度计数」自动播放开场）。

## 精简版结构

### 加载遮罩（自动播放，无需用户操作）
- 全屏主题底色（`--preview-bg`）+ 极淡网格层（`--preview-line-strong` 细线交叉，透明度 0.14）
- 居中「加载面板」：顶部 MCREATOPIA 标题（字号 `clamp(18px, 5.5vw, 26px)`，10 个字母在手机上也不溢出面板） → 0.25vw 级极细进度条（`max(1px, 0.25vw)`）+ 百分比 → monospace 终端日志逐行输出（`> Pre-fetching assets...` / `> Loading archive...` 等，每行 0.5s）
- 面板下方「点击任意位置开始」提示：默认隐藏，日志结束且进度 100% 后 `is-ready` 闪烁
- `TODO-AUDIO`：音频开关（Off/On）占位注释，待接入开场音效后实现

### 上滑过渡（点击触发）
- 加载中点击 = **跳过加载**立即播放过渡；加载完成后点击同样直接播放过渡
- 遮罩整体向上滑出退场：GSAP `yPercent: -100`、0.55s、`power2.inOut`
- 滑出动画 `onComplete` 后再 `emit('finish')`，保证视觉连贯（主界面在下方衔接进入）
- 根层不设背景色：滑出时露出下层 `GearBackground` 动态背景，过渡更自然

### 无障碍 / 防重入
- `prefers-reduced-motion`：系统开启「减少动态效果」时，跳过加载与过渡，短暂停留后直接进入主界面
- `done` 防重入标记：`finish` 事件只发出一次，避免重复触发

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `const emit = defineEmits(['finish'])` | 过渡完成或跳过后通知父组件（PreviewApp）切换主界面。 |
| `done` ref + `finish()` | 防重入标记，避免 onComplete 与重复点击重复触发 finish。 |
| `percent` ref + `.preview-intro__panel-bar` 的 `onUpdate` | 进度条 0 → 100% 时读取 GSAP 进度换算为 0-100，保证数字与细条严格同步。 |
| `LOG_LINES` + `runLog()` | 终端日志逐行输出（0.5s/行，monospace + `>` 前缀），营造「系统引导」感。 |
| `onClick()` → `playExit()` | 点击遮罩的统一入口：加载中点击 = 跳过加载立即播放过渡；`exitTl` 存在时忽略重复点击（防重入）。 |
| `playExit()` 中 `gsap.to('.preview-intro__overlay', { yPercent: -100, duration: 0.55, ease: 'power2.inOut', onComplete: finish })` | 遮罩上滑退场动画；过渡开始即 kill 加载动画、清除日志定时器；`onComplete` 后再 `finish`，保证视觉连贯。 |
| `prefersReducedMotion` | 读取系统「减少动态效果」偏好；开启时跳过加载与过渡，600ms 后直接进入主界面。 |
| `.preview-intro`（无 background） | 根层不设背景色，滑出时露出下层 GearBackground 动态背景，上滑过渡视觉更连贯。 |
| `.preview-intro__overlay`（background: var(--preview-bg)） | 全屏加载遮罩本体：覆盖背景层、承载网格/面板/提示；上滑退场由 GSAP 控制。 |
| `.preview-intro__overlay.is-hidden` | 已移除（精简版遮罩始终全屏显示，不再淡出，靠上滑整体退场）。 |
| `onBeforeUnmount` 清理 | 组件销毁前 kill 全部 GSAP timeline、清除日志定时器，避免内存泄漏。 |

## 已删除内容（相对三段式版本）
- 模板：`.preview-intro__scene`（双齿轮 SVG、眉题、拆字主标题、副文案、SCROLL DOWN CTA）、`.preview-intro__vignette` 底部压暗渐变、右上角版本号浮标（`v0.5.4 · PREVIEW`）
- JS：`titleChars` 拆字数组、`TEETH` 齿轮齿数常量、`entryTl` 入场时间线、`startScene()` 入场逻辑、`stage` ref（loading/started/done 分流）
- CSS：`.preview-intro__scene / __gears / __gear / __eyebrow / __title / __title-mask / __title-char / __sub / __cta / __vignette / __version` 相关样式

## TODO 备注清单
- `TODO-AUDIO`：音频开关（Off/On）占位——待接入开场音效后实现显式开关。
- `TODO-CONTENT`：终端日志文案待服主确认/定制。
