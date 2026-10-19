import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access') || null)
  const refreshToken = ref(localStorage.getItem('refresh') || null)
  const user = ref(null)
  const sessionError = ref('')
  let sessionRequest = null
  let refreshRequest = null
  let generation = 0

  const isLoggedIn = computed(() => !!accessToken.value)
  const isStaff = computed(() => !!user.value?.is_staff && user.value?.is_active !== false)

  function setTokens(access, refresh) {
    if (typeof access !== 'string' || !access || typeof refresh !== 'string' || !refresh) {
      throw new Error('服务返回的登录凭据不完整，请重新登录')
    }
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
  }

  async function microsoftLogin() {
    const res = await authApi.microsoftLogin()
    const url = res.data?.data?.authorize_url
    if (!url) throw new Error('未获取到授权链接')
    window.location.href = url
  }

  async function consumeMicrosoftCallback({ access, refresh }) {
    setTokens(access, refresh)
    try {
      await fetchMe()
    } catch (error) {
      logout()
      throw error
    }
  }

  function logout() {
    generation++
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    sessionError.value = ''
    sessionRequest = null
    refreshRequest = null
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
  }

  async function login(username, password) {
    const res = await authApi.login({ username, password })
    setTokens(res.data.access, res.data.refresh)
    try {
      await fetchMe()
    } catch (error) {
      logout()
      throw error
    }
  }

  async function register(username, email, password, passwordConfirm) {
    const res = await authApi.register({ username, email, password, password_confirm: passwordConfirm })
    if (res.status === 201) {
      try {
        await login(username, password)
      } catch (error) {
        error.registrationSucceeded = true
        throw error
      }
    }
  }

  function refresh() {
    if (refreshRequest) return refreshRequest
    const version = generation
    const request = authApi.refresh({ refresh: refreshToken.value }).then((res) => {
      if (version !== generation) throw new Error('会话已退出，请重新登录')
      setTokens(res.data.access, res.data.refresh || refreshToken.value)
    }).finally(() => {
      if (refreshRequest === request) refreshRequest = null
    })
    refreshRequest = request
    return refreshRequest
  }

  async function fetchMe() {
    const version = generation
    const res = await authApi.me()
    if (version !== generation) throw new Error('会话已退出，请重新登录')
    user.value = res.data.data
    sessionError.value = ''
    return user.value
  }

  function ensureSession() {
    if (!accessToken.value || user.value) return Promise.resolve(user.value)
    if (!sessionRequest) {
      const version = generation
      const request = fetchMe().catch((error) => {
        if (version === generation) sessionError.value = '无法读取玩家资料，请重试'
        throw error
      }).finally(() => {
        if (sessionRequest === request) sessionRequest = null
      })
      sessionRequest = request
    }
    return sessionRequest
  }

  return { accessToken, refreshToken, user, sessionError, isLoggedIn, isStaff, login, register, logout, refresh, fetchMe, ensureSession, microsoftLogin, consumeMicrosoftCallback }
})
