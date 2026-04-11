import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access') || null)
  const refreshToken = ref(localStorage.getItem('refresh') || null)
  const user = ref(null)

  const isLoggedIn = computed(() => !!accessToken.value)

  function setTokens(access, refresh) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
  }

  async function login(username, password) {
    const res = await authApi.login({ username, password })
    setTokens(res.data.access, res.data.refresh)
    await fetchMe()
  }

  async function register(username, email, password, passwordConfirm) {
    const res = await authApi.register({ username, email, password, password_confirm: passwordConfirm })
    // register 成功(201)后自动 login，login 失败单独抛出不影响注册结果
    if (res.status === 201) {
      await login(username, password)
    }
  }

  async function refresh() {
    const res = await authApi.refresh({ refresh: refreshToken.value })
    accessToken.value = res.data.access
    localStorage.setItem('access', res.data.access)
  }

  async function fetchMe() {
    const res = await authApi.me()
    user.value = res.data.data
  }

  // 初始化：如果有 token 就拉用户信息
  if (accessToken.value) {
    fetchMe().catch(() => logout())
  }

  return { accessToken, refreshToken, user, isLoggedIn, login, register, logout, refresh, fetchMe }
})
