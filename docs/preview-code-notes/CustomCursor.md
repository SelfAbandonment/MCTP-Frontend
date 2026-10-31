# CustomCursor.vue 说明

## 文件路径
`src/preview/components/CustomCursor.vue`

## 文件用途
预览页自定义光标：桌面端用铜黄「外环 + 内点」替换系统光标，外环延迟跟随、悬停可交互元素放大、按下收缩；触屏或「减少动态效果」用户不启用，回退系统光标。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `enabled` | 仅在 `(pointer: fine)` 且非 `prefers-reduced-motion` 时启用，保证触屏/无障碍可用性。 |
| `ringEl` / `dotEl` | 外环与内点两个 DOM 引用，直接改 style 性能更好（避免响应式高频更新）。 |
| `targetX/Y` + `curX/Y` + `loop()` | 外环用线性插值（lerp 0.18）延迟跟随形成拖尾；内点即时跟随。 |
| `INTERACTIVE` 选择器 + `onOver/onOut` | 悬停到 `a/button/summary/input/textarea/select/[data-cursor-hover]` 时给外环加 `is-active` 放大。 |
| `onDown/onUp` | 按下加 `is-down` 收缩，提供点击反馈。 |
| `has-custom-cursor` 类 | 挂到 `<html>`，配合 `base.css` 隐藏系统光标（输入框保留文本光标）。 |
| `preview-cursor-ring.is-active / .is-down` | 放大 / 收缩状态样式。 |

## 样式联动
- 隐藏系统光标规则在 `src/preview/styles/base.css`（`.has-custom-cursor .preview-root ...`）。

## TODO 备注清单
- 无
