const AUTH_CODE_MESSAGES = {
  invalid_login: '用户名或密码错误',
  invalid_credentials: '用户名或密码错误',
  email_required: '请填写邮箱',
  username_required: '请填写用户名',
  password_too_short: '密码长度不足',
  password_too_common: '密码过于常见',
  password_too_similar: '密码与账号信息过于相似',
  password_entirely_numeric: '密码不能全部是数字',
  password_mismatch: '两次密码不一致',
  user_already_exists: '该账号已存在',
  email_already_in_use: '该邮箱已被使用',
  username_already_in_use: '该用户名已被使用',
  signup_closed: '当前未开放注册',
  too_many_login_attempts: '尝试次数过多，请稍后再试',
  rate_limited: '请求过于频繁，请稍后再试',
  permission_denied: '登录失败：需要拥有 Minecraft 并完成账号校验',
  access_denied: '你取消了微软授权',
  cancelled: '你取消了微软授权',
}

function allauthFirstError(error) {
  const errors = error?.allauth?.errors
  return Array.isArray(errors) && errors.length ? errors[0] : null
}

export function errorMessage(error, fallback = '操作失败，请稍后重试') {
  if (error.code === 'ECONNABORTED') return '请求超时，请稍后重试'
  if (error.allauth) {
    const first = allauthFirstError(error)
    if (first) {
      return AUTH_CODE_MESSAGES[first.code] || (typeof first.message === 'string' && !/^[a-z_ ]+$/i.test(first.message)
        ? first.message : fallback)
    }
    return AUTH_CODE_MESSAGES[error.allauth.code] || fallback
  }
  if (!error.response) return error.message === 'Network Error' ? '无法连接服务，请检查网络或接口地址' : error.message || fallback
  if (error.response.status === 403) return '没有执行此操作的权限'
  if (error.response.status === 401) return '登录已失效，请重新登录'
  return error.response.data?.message || error.response.data?.detail || fallback
}

export function fieldErrors(error) {
  const allauthErrors = error?.allauth?.errors
  if (Array.isArray(allauthErrors) && allauthErrors.length) {
    const mapped = {}
    for (const item of allauthErrors) {
      const key = item.param || '__all__'
      if (key === '__all__') continue
      mapped[key] = AUTH_CODE_MESSAGES[item.code] || item.message || '填写有误'
    }
    return mapped
  }
  const data = error.response?.data?.data
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [
    key, Array.isArray(value) ? value.join('；') : String(value),
  ]))
}

export function localRedirect(value, fallback = '/dashboard') {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')
    ? value : fallback
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('zh-CN', { hour12: false })
}
