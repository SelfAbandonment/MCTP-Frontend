export function errorMessage(error, fallback = '操作失败，请稍后重试') {
  if (error.code === 'ECONNABORTED') return '请求超时，请稍后重试'
  if (!error.response) return error.message === 'Network Error' ? '无法连接服务，请检查网络或接口地址' : error.message || fallback
  if (error.response.status === 403) return '没有执行此操作的权限'
  if (error.response.status === 401) return '登录已失效，请重新登录'
  return error.response.data?.message || error.response.data?.detail || fallback
}

export function fieldErrors(error) {
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
