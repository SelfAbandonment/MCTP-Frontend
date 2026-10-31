---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_fbcec5c9d4a811f1a0da525400393706
    ReservedCode1: BXoAXbpqHx/u2LVMjd0VAp6PyGdWB0dD7SZKWs2BwGrUjNKjZ7ajPVrNNv0UZ8ptFqgqV/Ud4oqO3gFJoSrn6OBRSPA0cA+8+Q2fckzb1jqFYvdcbQANQ98OefC76juHAVMGR1DoNuQbuOm09q+V0TeZC+NCJjtH35ZwSvve65dClzz63liXGvN/SDs=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_fbcec5c9d4a811f1a0da525400393706
    ReservedCode2: BXoAXbpqHx/u2LVMjd0VAp6PyGdWB0dD7SZKWs2BwGrUjNKjZ7ajPVrNNv0UZ8ptFqgqV/Ud4oqO3gFJoSrn6OBRSPA0cA+8+Q2fckzb1jqFYvdcbQANQ98OefC76juHAVMGR1DoNuQbuOm09q+V0TeZC+NCJjtH35ZwSvve65dClzz63liXGvN/SDs=
---

# base.css 说明

## 文件路径
`src/preview/styles/base.css`

## 文件用途
预览页基础样式（根容器、主内容布局、卡片、按钮），全部选择器带 `preview-` 前缀避免污染现有框架。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `.preview-root` | 预览页根容器：撑满视口、继承主题变量与字体；`transition` 让主题切换背景/文字平滑过渡。 |
| `.preview-main` | 主内容容器：`min(1100px, 100% - 48px)` 限宽居中、上下留白、纵向 flex + gap 统一区块间距。 |
| `.preview-card` | 通用面板卡片：公告卡片、广告框、占位框共用，视觉统一（暗棕底 + 铜黄描边 + 阴影）。 |
| `.preview-section-title` | 区块标题：像素感字体 + 铜黄强调色，`letter-spacing` 增强工业风标题感。 |
| `.preview-btn` / `.preview-btn--ghost` | 通用主按钮（铜黄底）与次要按钮（幽灵描边），悬停有加深/上浮反馈。 |
| `.preview-btn:active` | 按钮按下轻微下沉，增强点击手感。 |
| `:focus-visible`（`.preview-root` 作用域） | 预览页内按钮/链接/输入/摘要的键盘焦点铜黄描边，保证无障碍且与铜黄主题一致。 |
| `.preview-card`（`scroll-margin-top: 84px`） | 区块卡片锚点滚动偏移，让锚点定位后标题不被固定顶栏遮挡。 |
| `.preview-feature__card:hover` 等悬停辉光规则 | 小型交互卡片悬停时描边转铜黄 + 柔光阴影，集中在基础层定义避免各组件重复写 hover。 |
| `.preview-root ::selection` | 预览页文字选中色：铜黄底深色字，与主视觉一致。 |
| `.preview-root ::-webkit-scrollbar*` | 自定义 WebKit 滚动条，使深色工业主题下滚动条更协调。 |
| `.preview-card` 四角 `radial-gradient` 铆钉 + `::before` 铜黄顶线 | 深褐平色大块易单调，加铆钉/顶线营造机械动力式工业细节；颜色跟随 `--preview-accent` 随主题联动。 |
| `.preview-card` / `.preview-btn` 的 `transition` | 主题切换与交互时背景/描边/颜色做 0.3s 平滑过渡。 |
| `.preview-main { padding-top: calc(96px + env(safe-area-inset-top)) }` / `.preview-header` 安全区 | 兼容 iPhone 刘海屏。 |
| `.preview-root img { -webkit-touch-callout: none; user-drag: none }` | 禁止长按图片弹菜单与拖拽，保持工业风观感。 |
| `.has-custom-cursor ...` | 启用自定义光标时隐藏系统光标（输入框保留文本光标）。 |

## TODO 备注清单
- 无（基础样式为通用层，后续新组件可直接复用这些类；滚动条仅覆盖 WebKit，Firefox 回退默认样式）。

