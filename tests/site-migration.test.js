import test, { after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
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
const { default: api } = await server.ssrLoadModule('/src/api/axios.js')
const { account, isLoggedIn, isAdmin, fromApiUser, logout } = await server.ssrLoadModule('/src/site/services/account.js')
const { loadAnnouncements, fromApiAnnouncement } = await server.ssrLoadModule('/src/site/services/announcements.js')
const { FEEDBACK_AVAILABLE, FEEDBACK_UNAVAILABLE, submitFeedback, validateFeedback } = await server.ssrLoadModule('/src/site/services/feedback.js')
const { dailyFortune } = await server.ssrLoadModule('/src/site/fortune/fortune.js')
after(() => server.close())

setActivePinia(createPinia())
beforeEach(() => {
  storage.clear()
  useAuthStore().$patch({ accessToken: null, refreshToken: null, user: null, sessionError: '' })
})

test('old mock account storage cannot authenticate or grant staff privileges', () => {
  storage.set('mctp-mock-account', JSON.stringify({ uid: 10001, role: 'admin' }))
  assert.equal(account.value, null)
  assert.equal(isLoggedIn.value, false)
  assert.equal(isAdmin.value, false)
})

test('site account reacts to real session and Minecraft profile changes', () => {
  const auth = useAuthStore()
  auth.accessToken = 'test-access'
  auth.user = { id: 42, username: 'Player', minecraft: { username: 'MinecraftPlayer' }, is_staff: true, is_active: true }
  assert.equal(account.value.uid, 42)
  assert.equal(account.value.name, 'MinecraftPlayer')
  assert.equal(isLoggedIn.value, true)
  assert.equal(isAdmin.value, true)
  auth.user.is_staff = false
  assert.equal(isAdmin.value, false)
  assert.equal(account.value.role, 'user')
  auth.accessToken = null
  assert.equal(account.value, null)
})

test('inactive staff profiles cannot be mapped to administrators', () => {
  assert.deepEqual(fromApiUser({ id: 5, username: 'Player', is_staff: true, is_active: false }), {
    uid: 5, name: 'Player', avatar: null, role: 'user',
  })
})

test('site logout clears the real session synchronously', () => {
  const auth = useAuthStore()
  auth.accessToken = 'test-access'
  auth.user = { id: 42, username: 'Player' }
  logout()
  assert.equal(auth.isLoggedIn, false)
  assert.equal(account.value, null)
})

test('announcement board uses real public API, skips credentials and limits to ten', async () => {
  const auth = useAuthStore()
  auth.accessToken = 'stale-access'
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/api/v1/announcements/')
    assert.equal(config.params.page, 1)
    assert.equal(config.headers.Authorization, undefined)
    return {
      config, status: 200, statusText: 'OK', headers: {},
      data: { data: { results: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, title: `公告 ${i}`, summary: '真实摘要' })) } },
    }
  }
  const items = await loadAnnouncements()
  assert.equal(items.length, 10)
  assert.deepEqual(items[0], { id: 1, cover: '', title: '公告 0', subtitle: '真实摘要', link: '/announcements/1' })
})

test('announcement board does not fabricate content on empty or failed API results', async () => {
  api.defaults.adapter = async (config) => ({
    config, status: 200, statusText: 'OK', headers: {}, data: { data: { results: [] } },
  })
  assert.deepEqual(await loadAnnouncements(), [])
  api.defaults.adapter = async () => { throw new Error('Network Error') }
  await assert.rejects(loadAnnouncements(), /Network/)
})

test('announcement board rejects malformed response data', async () => {
  api.defaults.adapter = async (config) => ({
    config, status: 200, statusText: 'OK', headers: {}, data: { data: {} },
  })
  await assert.rejects(loadAnnouncements(), /数据格式/)
  assert.throws(() => fromApiAnnouncement({ title: 'Missing ID' }), /数据格式/)
})

test('feedback remains explicitly unavailable and never records a fake successful submission', async () => {
  assert.equal(FEEDBACK_AVAILABLE, false)
  const before = storage.size
  await assert.rejects(submitFeedback(), { message: FEEDBACK_UNAVAILABLE })
  assert.equal(storage.size, before)
  assert.deepEqual(validateFeedback({ category: 'bug', customCategory: '', reportedUid: '', content: '真实问题' }), {})
})

test('daily fortune remains deterministic for the real account and date', () => {
  const day = new Date(2026, 10, 6)
  const fortune = dailyFortune(42, day)
  assert.deepEqual(fortune, dailyFortune(42, day))
  assert.notDeepEqual(fortune, dailyFortune(43, day))
  assert.equal(fortune.aspects.length, 6)
  assert.ok(fortune.aspects.every((aspect) => aspect.stars >= 1 && aspect.stars <= 5))
})

test('root entry uses new site while preserving protected business routes', async () => {
  const router = await readFile(new URL('../src/router/index.js', import.meta.url), 'utf8')
  const app = await readFile(new URL('../src/App.vue', import.meta.url), 'utf8')
  const shell = await readFile(new URL('../src/site/SiteShell.vue', import.meta.url), 'utf8')
  assert.match(app, /<SiteShell\s*\/>/)
  assert.doesNotMatch(shell, /DemoBadge/)
  assert.match(router, /site\/pages\/IndexPage\.vue/)
  assert.match(router, /site\/pages\/HomePage\.vue/)
  assert.match(router, /createWebHashHistory/)
  assert.match(router, /path: '\/home\/announcements',\s*redirect: '\/manage\/announcements'/)
  for (const path of ['/dashboard', '/points', '/manage/announcements', '/manage/players', '/manage/points']) {
    const start = router.indexOf(`path: '${path}'`)
    assert.notEqual(start, -1)
    assert.match(router.slice(start, router.indexOf('\n      },', start)), /requiresAuth: true/)
  }
})

test('business routes reuse Create panels and scoped brass controls without cinematic assets', async () => {
  const [router, authLayout, dashboard, styles] = await Promise.all([
    readFile(new URL('../src/router/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/AuthLayout.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/views/DashboardView.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/style.css', import.meta.url), 'utf8'),
  ])
  assert.match(router, /component: BusinessPage/)
  for (const page of [authLayout, dashboard]) {
    assert.match(page, /<CreatePanel/)
    assert.match(page, /<PixelText/)
    assert.doesNotMatch(page, /assets\/media|player-welcome__scene/)
  }
  assert.match(authLayout, /<slot\s*\/>/)
  assert.match(styles, /\.business-page\s*\{/)
  assert.match(styles, /--brand:\s*var\(--brass\)/)
  assert.doesNotMatch(styles, /legacy-page|#8ce06a|border-radius:\s*[1-9]/)
  for (const panel of ['CommunityPulse', 'Points', 'Account', 'Minecraft', 'Security', 'Service']) {
    assert.match(dashboard, new RegExp(`<${panel}Panel\\s*/>`))
  }
})
