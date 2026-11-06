// 管理员"切换成普通玩家视角"：只影响显示（isAdmin），不改变真实权限（isRealAdmin / auth.isStaff）
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

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const { useAuthStore } = await server.ssrLoadModule('/src/stores/auth.js')
const { isAdmin, isRealAdmin, viewAsPlayer, setViewAsPlayer, logout } = await server.ssrLoadModule('/src/site/services/account.js')
after(() => server.close())

setActivePinia(createPinia())
beforeEach(() => {
  storage.clear()
  setViewAsPlayer(false)
  useAuthStore().$patch({ accessToken: null, refreshToken: null, user: null, sessionError: '' })
})

function signIn(isStaff) {
  const auth = useAuthStore()
  auth.accessToken = 'test-access'
  auth.user = { id: 7, username: 'Brass', is_staff: isStaff, is_active: true }
  return auth
}

test('staff can switch to player view without losing real staff permission', () => {
  const auth = signIn(true)
  assert.equal(isAdmin.value, true)
  setViewAsPlayer(true)
  assert.equal(viewAsPlayer.value, true)
  assert.equal(isAdmin.value, false)
  assert.equal(isRealAdmin.value, true)
  assert.equal(auth.isStaff, true)
  assert.equal(storage.get('mctp-view-as-player'), '1')
  setViewAsPlayer(false)
  assert.equal(isAdmin.value, true)
  assert.equal(storage.has('mctp-view-as-player'), false)
})

test('non-staff accounts cannot turn on the player view flag', () => {
  signIn(false)
  setViewAsPlayer(true)
  assert.equal(viewAsPlayer.value, false)
  assert.equal(isAdmin.value, false)
  assert.equal(storage.has('mctp-view-as-player'), false)
})

test('the stored flag can never grant admin display to a non-staff account', () => {
  storage.set('mctp-view-as-player', '0')
  signIn(false)
  assert.equal(isAdmin.value, false)
})

test('logging out resets the player view', () => {
  signIn(true)
  setViewAsPlayer(true)
  logout()
  assert.equal(viewAsPlayer.value, false)
  assert.equal(storage.has('mctp-view-as-player'), false)
})
