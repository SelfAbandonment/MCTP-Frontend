import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://mctp-api.onrender.com',
  timeout: 10000,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const auth = useAuthStore()
    const originalRequest = err.config || {}
    const isRefreshRequest = originalRequest.url?.includes('/api/v1/auth/token/refresh/')

    if (err.response?.status === 401 && auth.refreshToken && !originalRequest._retry && !isRefreshRequest) {
      try {
        originalRequest._retry = true
        await auth.refresh()
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`
        return api.request(originalRequest)
      } catch {
        auth.logout()
      }
    }
    return Promise.reject(err)
  }
)

export default api
