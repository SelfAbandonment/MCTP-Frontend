---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_f82f8860d4a811f1a0da525400393706
    ReservedCode1: 5X8qOUoVSFqeorOIsq9nMlGA9lT3NFpT4yUcSqHyE/vDEumRxFy2A188LDNZKY6ykqtlJoMZtzWmzR0wI5GvDTropJKZ32ulp8cpxPFxbeqGG6SGUjcUGYCroU0RpW03kSMuIOICNJUpGYUnup3uqBkpypIMvNKSwxy+ssNMdKEHPY+1zxrv/ljZG1E=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_f82f8860d4a811f1a0da525400393706
    ReservedCode2: 5X8qOUoVSFqeorOIsq9nMlGA9lT3NFpT4yUcSqHyE/vDEumRxFy2A188LDNZKY6ykqtlJoMZtzWmzR0wI5GvDTropJKZ32ulp8cpxPFxbeqGG6SGUjcUGYCroU0RpW03kSMuIOICNJUpGYUnup3uqBkpypIMvNKSwxy+ssNMdKEHPY+1zxrv/ljZG1E=
---

# src/router/index.js 修改说明

## 文件路径
`src/router/index.js`（现有主路由文件，仅追加，未删改任何现有路由）

## 本次改动说明

| 改动 | 为什么写 / 作用是什么 |
| --- | --- |
| 顶部 `import previewRoutes from '@/preview/router/previewRoutes'` | 引入预览页独立路由模块，预览页代码整体留在 `src/preview/`，对主路由文件只做一处追加，便于后续 PR 评审。 |
| 在 catch-all 路由之前 `routes.push(...previewRoutes)` 等价展开 | 将 `/preview` 路由注入主路由表；放在 catch-all 前保证不被通配路由拦截，又不改动任何现有路由定义。 |
| `/preview` 路由自带 `meta.chrome: false` | 让现有 `App.vue` 的全局 Header/Footer 对预览页不渲染，预览页保持独立全屏布局。 |

## 影响范围
- 现有页面路由完全未动，`npm run dev` 后既有页面行为不变。
- 新增访问路径：`/MCTP-Frontend/#/preview`（hash 模式）。

## TODO 备注清单
- 无（后续如预览页需要更多路由，直接在 `previewRoutes.js` 内扩展 children 即可）。