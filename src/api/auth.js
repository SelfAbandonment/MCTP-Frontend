import api from './axios'

export const authApi = {
  register: (data) => api.post('/api/v1/auth/register/', data),
  login: (data) => api.post('/api/v1/auth/token/', data),
  refresh: (data) => api.post('/api/v1/auth/token/refresh/', data),
  me: () => api.get('/api/v1/auth/me/'),
  updateMe: (data) => api.put('/api/v1/auth/me/', data),
}
