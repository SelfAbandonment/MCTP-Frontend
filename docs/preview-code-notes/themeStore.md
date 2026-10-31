---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_f911e0a7d4a811f1a0da525400393706
    ReservedCode1: M6R7i31ed2EIk3y2dnBbj0g4kVC4YVFOXBfRaoHdHVKHs/jY20OrLUycBb2Bxb2tLT/oKpu2/dwBYyd1Ia1g6lBRhirIHgxHkWKJIKjWDNHazeMgnGvt/V9gP0ABgr0N3HiIn1Tr59tMVF7LIRTWGWShSR3V/Dnh3xJCmPdepEmk0RXmqEXc+1wMfOI=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_f911e0a7d4a811f1a0da525400393706
    ReservedCode2: M6R7i31ed2EIk3y2dnBbj0g4kVC4YVFOXBfRaoHdHVKHs/jY20OrLUycBb2Bxb2tLT/oKpu2/dwBYyd1Ia1g6lBRhirIHgxHkWKJIKjWDNHazeMgnGvt/V9gP0ABgr0N3HiIn1Tr59tMVF7LIRTWGWShSR3V/Dnh3xJCmPdepEmk0RXmqEXc+1wMfOI=
---

# themeStore.js 说明

## 文件路径
`src/preview/stores/themeStore.js`

## 文件用途
预览页三主题（黑夜 / 白天 / 护眼）切换的 Pinia store，驱动 CSS 变量换肤并持久化用户选择。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `export const THEMES = { night, day, eye }` | 主题枚举集中定义，供 ThemeSwitcher 渲染按钮与 setTheme 校验使用，避免字符串散落硬编码。 |
| `const STORAGE_KEY = 'mctp-preview-theme'` | 加 `mctp-preview-` 前缀，避免与现有框架或其他应用 localStorage 键冲突。 |
| `const DEFAULT_THEME = 'night'` | 骨架默认黑夜，与黄铜深褐主背景一致。 |
| `theme = ref(DEFAULT_THEME)` | 当前主题的响应式状态，供组件高亮当前按钮。 |
| `initTheme()` | 应用入口初始化：读取 localStorage，无记录用默认黑夜；必须在渲染前调用，避免首帧闪默认主题。 |
| `applyTheme()` | 写入 `document.documentElement.dataset.theme` 并持久化；CSS 通过 `html[data-theme]` 覆盖变量实现整体换肤，无需逐组件传参。 |
| `setTheme(key)` | 供 ThemeSwitcher 调用；对非法 key 做防御，避免异常数据破坏页面主题。 |
| `clearTheme()` | 离开预览页时删除 `html[data-theme]`，避免预览页主题标记残留到现有页面。 |
| `try { localStorage... } catch` | 隐私模式 / 禁用站点数据时 localStorage 会抛异常，兜底为默认主题，避免白屏。 |

## TODO 备注清单
- 无（三主题已实做；后续如需自定义主题色可扩展 THEMES）。

