---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_fae24c82d4a811f1a0da525400393706
    ReservedCode1: lxD3sZZNXlhMjKRdiRVWwl/LobbtXzD3y+iwvcEO17LSGt2YDagW3L6qQpkBlHpmN2vijQgozDYXbhozQkPC0HDDocZWgbH0K7e3M+bOE7iLtu+VFYnIysoa/YSKJuGM+EsvY8Cyjy2X2cGz/+ouNnXj5257j62Ocz4nVV34y8y9rl4TcLrifzRdMh0=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_fae24c82d4a811f1a0da525400393706
    ReservedCode2: lxD3sZZNXlhMjKRdiRVWwl/LobbtXzD3y+iwvcEO17LSGt2YDagW3L6qQpkBlHpmN2vijQgozDYXbhozQkPC0HDDocZWgbH0K7e3M+bOE7iLtu+VFYnIysoa/YSKJuGM+EsvY8Cyjy2X2cGz/+ouNnXj5257j62Ocz4nVV34y8y9rl4TcLrifzRdMh0=
---

# theme.css 说明

## 文件路径
`src/preview/styles/theme.css`

## 文件用途
预览页三主题 CSS 变量定义（机械动力黄铜深褐风格），通过 `html[data-theme]` 切换。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| 字体说明注释（原 Google Fonts `@import` 已删除） | 字体改为本地自托管，在 `PreviewApp.vue` 中通过 `@fontsource/*` 引入；本文件只保留 `--preview-font` 字体栈（Pixelify Sans → VT323 → Microsoft YaHei）。原因：国内访问 Google Fonts 常失败，会丢失像素风。 |
| `:root, html[data-theme='night'] { --preview-* }` | 默认黑夜主题：主背景深褐 `#2b2118`、面板暗棕 `#3a2e22`、强调金属铜黄 `#c88a3a`，与机械动力模组黄铜深褐基调一致。 |
| `--preview-font` | 字体变量：首选 Pixelify Sans，VT323 为备选（注释中已写明）。 |
| `html[data-theme='day'] { --preview-* }` | 白天主题：底色提亮、文字转深，强调色弱化为低饱和铜黄 `#b8863f`，更适合浅底阅读。 |
| `html[data-theme='eye'] { --preview-* }` | 护眼主题：低对比暖绿底色，强调色改偏暖绿 `#7f8f39`，与底色呼应。 |
| 强调色 `--preview-accent` 全局复用 | 铆钉/顶线/描边/按钮均取自该变量，切换主题时装饰线随强调色一起联动。 |
| 各主题内 `color-scheme` | 让原生表单控件/滚动条按对应深色/浅色渲染，与主题一致。 |
| 所有变量带 `--preview-` 前缀 | 与现有框架 `--bg-base`/`--brand` 等变量隔离，避免样式互相污染。 |

## TODO 备注清单
- 无（三主题配色已实做；后续可微调配色数值）。

