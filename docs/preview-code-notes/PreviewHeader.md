---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_101b7688d50211f180d5525400248c00
    ReservedCode1: 5kkitEGlnxPPWEONcvFnD0Wbd1obUNt7sp9Kvs2pq3Erg0dpJRfBYHuVK1ZDdXfKIqM2hHQCK10Gr+HyjKIUrkiFADimW8SgSCEFhvqg0keAVAr4fqoLkCNqmpU4PkptEKGyZp9XIlO6thWnGzhVvaQS61/+uMyFZO6qAQL5MGWI+OxCZQH/nNHav/E=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_101b7688d50211f180d5525400248c00
    ReservedCode2: 5kkitEGlnxPPWEONcvFnD0Wbd1obUNt7sp9Kvs2pq3Erg0dpJRfBYHuVK1ZDdXfKIqM2hHQCK10Gr+HyjKIUrkiFADimW8SgSCEFhvqg0keAVAr4fqoLkCNqmpU4PkptEKGyZp9XIlO6thWnGzhVvaQS61/+uMyFZO6qAQL5MGWI+OxCZQH/nNHav/E=
---



# PreviewHeader.vue 说明

## 文件路径
`src/preview/components/PreviewHeader.vue`

## 文件用途
预览页顶部导航组件：左侧品牌 LOGO（旋转齿轮 + 站点名）、中间锚点导航、右侧账号区（登录前/后两态）+ 主题三模式切换；滚动后顶栏加深并加阴影/辉光。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `import AccountArea / ThemeSwitcher` | 顶栏由账号区与主题切换两个子组件组合，职责单一、便于独立维护。 |
| `navItems` | 锚点导航项（公告/玩法/下载/活动/留言），对应各区块的 `id`。 |
| `scrolled` ref + `onScroll()` | 监听滚动，超过阈值后置 `scrolled=true`，给顶栏加 `is-scrolled` 加深并加阴影。 |
| `scrollToId(id)` | 用 `scrollIntoView` 平滑定位到目标区块；因站点用 hash 路由，写 `<a href="#id">` 会改变路由 hash 导致误判，故改用 JS 定位。 |
| `.preview-header__gear` + `@keyframes preview-header-spin` | 品牌齿轮图标缓慢旋转，呼应机械动力主题。 |
| `.preview-header__nav` | 锚点导航居中占满剩余空间；`@media (max-width:860px)` 隐藏，避免窄屏拥挤。 |
| `.preview-header.is-scrolled` | 滚动后顶栏更实、底部分隔线加铜黄辉光，强化层级。 |
| `.preview-header` + `animation: preview-header-fade 0.6s ease-out both` | 顶栏挂载时淡入，衔接 intro 遮罩上滑退场；只用 opacity 不动 transform，避免给 fixed 顶栏叠加 transform 产生包含块副作用。 |
| `.preview-header__name` | 站点名文字：已由「MCTP · 机械动力」改为完整名「MCREATOPIA」。 |

## TODO 备注清单
- 无（导航已实做；后续如需下拉菜单 / 多语言可在此扩展）。

