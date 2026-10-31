---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_003059fed4a911f1a0da525400393706
    ReservedCode1: eno0GDn0qdkjmhcXk3sRy6tY3v3uMsoBCjEsgiMzr9r2NWGmw8Oijm00mWzozGTNgpPhkLk7lgik+5topOEVfuJ1k68oOiQrfjMREktHxGxod5EU7glAqXwY0CFJhiL4surf63SLcJ6VVwy2ULfPwG5Kr8yO9DpySGr7FwhdpfyEHZDJ0OHg8qFT+Hg=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_003059fed4a911f1a0da525400393706
    ReservedCode2: eno0GDn0qdkjmhcXk3sRy6tY3v3uMsoBCjEsgiMzr9r2NWGmw8Oijm00mWzozGTNgpPhkLk7lgik+5topOEVfuJ1k68oOiQrfjMREktHxGxod5EU7glAqXwY0CFJhiL4surf63SLcJ6VVwy2ULfPwG5Kr8yO9DpySGr7FwhdpfyEHZDJ0OHg8qFT+Hg=
---

# AccountArea.vue 说明

## 文件路径
`src/preview/components/AccountArea.vue`

## 文件用途
预览页左上角账号区：登录前显示「登录 / 注册」，登录后显示头像占位 + 用户名 + 退出按钮。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `storeToRefs(authStore)` 取 `user` | 解包响应式 user，模板中按 `user` 是否为 null 渲染双态 UI。 |
| `v-if="!user"` 分支 | 未登录态：显示「登录 / 注册」幽灵按钮，点击触发 `authStore.login()` 模拟登录。 |
| `v-else` 分支 | 已登录态：显示 `avatar` 占位头像（SVG）、`name` 用户名与「退出」按钮，点击 `logout()` 模拟退出。 |
| `.preview-account__avatar` | 头像 36x36 圆形裁切 + 铜黄描边，保证占位头像显示规整。 |

## TODO 备注清单
- `TODO-ASSET: 玩家头像真实素材待补`（见 previewAuthStore.js）
- `TODO-BACKEND: 待对接真实登录 / 登出接口`（当前为本地模拟，点击即切换）

