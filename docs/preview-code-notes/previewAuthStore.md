---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_f9fa145fd4a811f1a0da525400393706
    ReservedCode1: GQA7aKMO7XrOldJ9O9lt7096oStxt3i0TaqBtkAz1QquAAsju95O/T9Pdf8chTHVxGsmUxksqPCDv8fiwhtQX3AmVSbK308hs9gPxsmkSm9iK3ueDxsZY74VLb4Z6SAo2fbJCboMJd+MvOT/5Y6QG5ktVCvzgTcIqtyhRDsqtrQsSXx8iKSLwqkDfHc=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_f9fa145fd4a811f1a0da525400393706
    ReservedCode2: GQA7aKMO7XrOldJ9O9lt7096oStxt3i0TaqBtkAz1QquAAsju95O/T9Pdf8chTHVxGsmUxksqPCDv8fiwhtQX3AmVSbK308hs9gPxsmkSm9iK3ueDxsZY74VLb4Z6SAo2fbJCboMJd+MvOT/5Y6QG5ktVCvzgTcIqtyhRDsqtrQsSXx8iKSLwqkDfHc=
---

# previewAuthStore.js 说明

## 文件路径
`src/preview/stores/previewAuthStore.js`

## 文件用途
预览页账号区的本地模拟登录状态 store，演示「登录前 / 登录后」两种账号区 UI。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `import avatarPlaceholder from '@/preview/assets/placeholders/avatar.svg'` | 头像占位素材走 Vite 资源导入，构建期自动处理路径，比硬编码字符串更可靠。 |
| `const DEMO_USER = { name: 'SteelSmith', avatar }` | 模拟已登录玩家信息；头像为占位 SVG，名字为演示数据。 |
| `const user = ref(null)` | `null` 表示未登录；非 null 表示已登录，驱动 AccountArea 双态渲染。 |
| `login()` | 模拟登录：点击「登录/注册」后立即切到已登录状态，用于骨架演示流程。 |
| `logout()` | 模拟退出登录，回到未登录状态。 |

## TODO 备注清单
- `TODO-ASSET: 玩家头像真实素材待补，当前使用占位 SVG`（源码注释内）
- `TODO-BACKEND: 待对接真实登录接口（可复用现有 src/api/auth.js 或 /auth 接口）`
- `TODO-BACKEND: 待对接真实登出接口`
