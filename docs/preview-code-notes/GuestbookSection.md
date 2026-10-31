---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_0cd2f3c4d4a911f1a0da525400393706
    ReservedCode1: nas0zWeNbpDbwOaigEJ4CxAN6Xo/DBHxkl+XBetKnT/hlvgIDob/JCIYZxpGRUnEx+uQS+DZ/+OLBd+Hgv54c2pkIHJwLwYqOu6TKhPe6qX6Z37MasHQgQ3SHwlZ7f3p9Zb50Fo9QZsYYoq2mGfTG5XuQgkKQR7rIir69s5gPg9DXJCZM8WEFFLsTDw=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_0cd2f3c4d4a911f1a0da525400393706
    ReservedCode2: nas0zWeNbpDbwOaigEJ4CxAN6Xo/DBHxkl+XBetKnT/hlvgIDob/JCIYZxpGRUnEx+uQS+DZ/+OLBd+Hgv54c2pkIHJwLwYqOu6TKhPe6qX6Z37MasHQgQ3SHwlZ7f3p9Zb50Fo9QZsYYoq2mGfTG5XuQgkKQR7rIir69s5gPg9DXJCZM8WEFFLsTDw=
---

# GuestbookSection.vue 说明

## 文件路径
`src/preview/components/GuestbookSection.vue`

## 文件用途
功能 G——玩家留言 / 评论组件：提供留言表单（昵称 + 内容）与留言列表，前端交互真实可用，并用 localStorage 持久化模拟后端。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `STORAGE_KEY` | localStorage 存储键（`mctp-preview-guestbook`），加前缀避免与其他模块冲突。 |
| `messages` / `nickname` / `content` | 响应式 ref：留言列表与表单字段。 |
| `onMounted` 读取 | 挂载时从 localStorage 恢复历史留言（JSON 解析，损坏时降级为空列表）。 |
| `watch(messages)` | 列表变化时自动写回 localStorage（deep 监听），提交后无需手动再存。 |
| `submitMessage()` | 校验非空后构造留言对象（id=时间戳）插入列表头部并清空内容框；真实场景由后端接口完成持久化。 |
| `formatTime(iso)` | 将 ISO 时间转本地 `年-月-日 时:分` 文本。 |
| `@submit.prevent` | 阻止表单默认提交行为，走前端交互。 |
| 空状态提示 | `messages.length === 0` 时显示「还没有留言」，避免空白区域。 |
| `.preview-guest__note` | TODO-BACKEND 提示，待对接后端留言接口。 |

## 预留 API 封装
- `src/preview/api/guestbook.js`：复用 `@/api/axios`，预留 `guestbookApi.list / create`，待后端提供接口后替换 localStorage 逻辑。

## TODO 备注清单
- `TODO-BACKEND: 留言持久化为 localStorage 模拟（刷新页面仍保留），待接入 src/preview/api/guestbook.js 的后端接口`

