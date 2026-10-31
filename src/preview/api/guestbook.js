/**
 * 文件用途：预览页留言板 API 封装（预留位置，当前未启用）
 * 作用：复用仓库现有 axios 实例（@/api/axios），预留留言列表/提交接口封装；
 *       待后端提供留言接口后，在 GuestbookSection 中替换 localStorage 逻辑即可。
 */

import api from '@/api/axios'

// TODO-BACKEND: 以下为留言接口预留封装（端点路径以最终后端为准），当前预览页仍用 localStorage 模拟。
//   - 列表：GET  /api/v1/guestbook/
//   - 提交：POST /api/v1/guestbook/
export const guestbookApi = {
  list: (signal) => api.get('/api/v1/guestbook/', { signal, skipAuth: true }),
  create: (data) => api.post('/api/v1/guestbook/', data, { skipAuth: true }),
}
