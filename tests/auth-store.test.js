import test, { after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createPinia, setActivePinia } from 'pinia'

const storage = new Map()
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
}
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { useAuthStore } = await server.ssrLoadModule('/src/stores/auth.js')
const { default: api } = await server.ssrLoadModule('/src/api/axios.js')
after(() => server.close())

beforeEach(() => {
  storage.clear()
  setActivePinia(createPinia())
})

function respond(config, data, status = 200) {
  return { data, status, statusText: 'OK', headers: {}, config }
}

test('concurrent token refresh rotates both credentials once', async () => {
  const auth = useAuthStore()
  let calls = 0
  auth.refreshToken = 'old-refresh'
  api.defaults.adapter = async (config) => {
    calls++
    return respond(config, { access: 'new-access', refresh: 'new-refresh' })
  }
  await Promise.all([auth.refresh(), auth.refresh(), auth.refresh()])
  assert.equal(calls, 1)
  assert.equal(auth.accessToken, 'new-access')
  assert.equal(auth.refreshToken, 'new-refresh')
  assert.equal(storage.get('refresh'), 'new-refresh')
})

test('session initialization is deduplicated and derives staff role from backend', async () => {
  const auth = useAuthStore()
  auth.accessToken = 'access'
  let calls = 0
  api.defaults.adapter = async (config) => {
    calls++
    return respond(config, { data: { id: 1, is_staff: true, is_active: true } })
  }
  await Promise.all([auth.ensureSession(), auth.ensureSession()])
  assert.equal(calls, 1)
  assert.equal(auth.isStaff, true)
})

test('network failures preserve credentials and allow retry', async () => {
  const auth = useAuthStore()
  auth.accessToken = 'access'
  api.defaults.adapter = async () => { throw new Error('Network Error') }
  await assert.rejects(auth.ensureSession(), /Network/)
  assert.equal(auth.accessToken, 'access')
  assert.match(auth.sessionError, /重试/)
  api.defaults.adapter = async (config) => respond(config, { data: { id: 2, is_staff: false } })
  await auth.ensureSession()
  assert.equal(auth.sessionError, '')
  assert.equal(auth.isStaff, false)
})

test('public announcements never send stale login credentials', async () => {
  const auth = useAuthStore()
  auth.accessToken = 'stale'
  api.defaults.adapter = async (config) => {
    assert.equal(config.headers.Authorization, undefined)
    return respond(config, { data: { results: [], count: 0 } })
  }
  await api.get('/api/v1/announcements/', { skipAuth: true })
})

test('concurrent unauthorized requests share one refresh and retry with new access', async () => {
  const auth = useAuthStore()
  auth.accessToken = 'expired'
  auth.refreshToken = 'refresh'
  let refreshCalls = 0
  api.defaults.adapter = async (config) => {
    if (config.url.includes('token/refresh')) {
      refreshCalls++
      return respond(config, { access: 'renewed', refresh: 'rotated' })
    }
    if (!config._retry) {
      throw Object.assign(new Error('Unauthorized'), { config, response: { status: 401 } })
    }
    assert.equal(config.headers.Authorization, 'Bearer renewed')
    return respond(config, { data: { id: 2 } })
  }
  await Promise.all([api.get('/private-a'), api.get('/private-b')])
  assert.equal(refreshCalls, 1)
  assert.equal(auth.refreshToken, 'rotated')
})

test('failed refresh distinguishes rejected credentials from network interruption', async () => {
  const auth = useAuthStore()
  auth.accessToken = 'expired'
  auth.refreshToken = 'refresh'
  api.defaults.adapter = async (config) => {
    if (config.url.includes('token/refresh')) throw new Error('Network Error')
    throw Object.assign(new Error('Unauthorized'), { config, response: { status: 401 } })
  }
  await assert.rejects(api.get('/private'), /Network/)
  assert.equal(auth.accessToken, 'expired')
  api.defaults.adapter = async (config) => {
    throw Object.assign(new Error('Unauthorized'), { config, response: { status: 401 } })
  }
  await assert.rejects(api.get('/private'), /Unauthorized/)
  assert.equal(auth.accessToken, null)
})

test('late profile and refresh responses cannot resurrect a logged-out session', async () => {
  const auth = useAuthStore()
  auth.accessToken = 'access'
  auth.refreshToken = 'refresh'
  let resolveRequest
  api.defaults.adapter = (config) => new Promise((resolve) => {
    resolveRequest = (data) => resolve(respond(config, data))
  })
  const pending = auth.fetchMe()
  await new Promise((resolve) => setImmediate(resolve))
  auth.logout()
  resolveRequest({ data: { id: 1, is_staff: true } })
  await assert.rejects(pending, /会话已退出/)
  assert.equal(auth.user, null)
  const refresh = auth.refresh()
  await new Promise((resolve) => setImmediate(resolve))
  auth.logout()
  resolveRequest({ access: 'late', refresh: 'late-refresh' })
  await assert.rejects(refresh, /会话已退出/)
  assert.equal(auth.accessToken, null)
})
