import api from './axios'
import { allauthApi, getCsrfToken } from './allauth'

export const authApi = {
  // JWT API (kept for every /api/v1/ call; obtained after allauth login)
  refresh: (data) => api.post('/api/v1/auth/token/refresh/', data),
  me: () => api.get('/api/v1/auth/me/'),
  updateMe: (data) => api.put('/api/v1/auth/me/', data),
  changePassword: (data) => api.post('/api/v1/auth/password/', data),
  sessionToken: async () => {
    await allauthApi.config()
    return api.post('/api/v1/auth/token/session/', null, {
      headers: { 'X-CSRFToken': getCsrfToken() },
    })
  },
  microsoftUnbind: () => api.delete('/api/v1/auth/microsoft/unbind/'),
}
