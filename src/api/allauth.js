import { API_BASE_URL } from './axios'

// allauth headless "browser" client: session cookie + CSRF cookie. This is
// intentionally used for local development (same-site localhost). Production
// cross-site hosting needs a same-site proxy or the app-client/JWT flow.
const BASE = `${API_BASE_URL}/_allauth/browser/v1`

function readCookie(name) {
  const prefix = `${name}=`
  const hit = document.cookie.split(';').map((item) => item.trim()).find((item) => item.startsWith(prefix))
  return hit ? decodeURIComponent(hit.slice(prefix.length)) : ''
}

export function getCsrfToken() {
  return readCookie('csrftoken')
}

let configPromise = null

export function loadConfig() {
  if (!configPromise) {
    configPromise = fetch(`${BASE}/config`, {
      method: 'GET',
      credentials: 'include',
      headers: { accept: 'application/json' },
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        configPromise = null
        throw Object.assign(new Error('无法初始化登录服务'), { status: response.status, allauth: data })
      }
      return data
    }).catch((error) => {
      configPromise = null
      throw error
    })
  }
  return configPromise
}

async function request(path, { method = 'GET', data } = {}) {
  await loadConfig()
  const response = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'X-CSRFToken': getCsrfToken(),
      ...(data === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
  const payload = await response.json().catch(() => ({ status: response.status }))
  if (!response.ok) {
    throw Object.assign(new Error(payload?.errors?.[0]?.message || '请求失败'), {
      status: response.status,
      allauth: payload,
    })
  }
  return payload
}

export function callbackUrl() {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin).href
  return `${base}#/auth/microsoft/callback`
}

async function redirectToProvider(provider, process) {
  await loadConfig()
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = `${BASE}/auth/provider/redirect`
  form.style.display = 'none'
  const fields = {
    provider,
    process,
    callback_url: callbackUrl(),
    csrfmiddlewaretoken: getCsrfToken(),
  }
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}

export const allauthApi = {
  config: loadConfig,
  session: () => request('/auth/session'),
  login: (data) => request('/auth/login', { method: 'POST', data }),
  signup: (data) => request('/auth/signup', { method: 'POST', data }),
  logout: () => request('/auth/session', { method: 'DELETE' }),
  redirectToProvider,
}
