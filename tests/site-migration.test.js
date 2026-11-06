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
  assert.match(router, /path: '\/dashboard',\s*redirect: '\/home'/)
  for (const path of ['/home', '/points', '/manage/announcements', '/manage/players', '/manage/points']) {
    const start = router.indexOf(`path: '${path}'`)
    assert.notEqual(start, -1)
    assert.match(router.slice(start, router.indexOf('\n  },', start)), /requiresAuth: true/)
  }
})

test('business routes reuse Create panels and scoped brass controls without cinematic assets', async () => {
  const [router, authLayout, panels, home, styles] = await Promise.all([
    readFile(new URL('../src/router/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/AuthLayout.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/dashboard/PlayerAccountPanels.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/site/pages/HomePage.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/style.css', import.meta.url), 'utf8'),
  ])
  assert.match(router, /component: BusinessPage/)
  assert.match(authLayout, /<CreatePanel/)
  for (const page of [authLayout, home]) {
    assert.match(page, /<PixelText/)
    assert.doesNotMatch(page, /assets\/media|player-welcome__scene/)
  }
  assert.match(authLayout, /<slot\s*\/>/)
  assert.match(styles, /\.business-page\s*\{/)
  assert.match(styles, /--brand:\s*var\(--brass\)/)
  assert.doesNotMatch(styles, /legacy-page|#8ce06a|border-radius:\s*[1-9]/)
  for (const panel of ['CommunityPulse', 'Points', 'Account', 'Minecraft', 'Security', 'Service']) {
    assert.match(panels, new RegExp(`<${panel}Panel\\s*/>`))
  }
})

test('ordinary routing selects the short transition without changing first boot branding', async () => {
  const transition = await server.ssrLoadModule('/src/site/composables/usePageTransition.js')
  let callbacks
  const unregister = transition.registerTransition((options) => { callbacks = options })
  try {
    const covered = transition.coverScreen()
    assert.equal(callbacks.kind, 'page')
    callbacks.onCovered()
    await covered
    assert.equal(transition.isTransitionRunning(), true)
    callbacks.onComplete()
    await transition.whenTransitionDone()
    assert.equal(transition.isTransitionRunning(), false)
    const boot = transition.playTransition()
    assert.equal(callbacks.kind, 'brand')
    callbacks.onComplete()
    await boot
  } finally {
    unregister()
  }
})

test('navigation has one global entry layer and native limited language controls', async () => {
  const [nav, business, language, translations] = await Promise.all([
    readFile(new URL('../src/site/components/SiteNav.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/BusinessPage.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/site/components/LanguagePicker.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/site/i18n.js', import.meta.url), 'utf8'),
  ])
  assert.doesNotMatch(business, /<nav/)
  for (const path of ['/home', '/announcements', '/home#features', '/feedback', '/home#account', '/points', '/register']) {
    assert.ok(nav.includes(path))
  }
  assert.match(nav, /<details/)
  assert.match(nav, /closeMenu\(true\)/)
  assert.match(language, /<select/)
  assert.match(language, /v-for="language in LANGS"/)
  assert.match(translations, /code: 'zh-CN'/)
  assert.match(translations, /code: 'en'/)
  assert.equal((translations.match(/code: /g) || []).length, 2)
  assert.match(language, /仅切换主导航/)
  assert.match(translations, /document\.documentElement\.lang = 'zh-CN'/)
})

test('home and unavailable feedback expose semantic headings and no scroll capture', async () => {
  const [home, board, feedback] = await Promise.all([
    readFile(new URL('../src/site/pages/HomePage.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/site/components/home/FlapBoard.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/site/pages/FeedbackPage.vue', import.meta.url), 'utf8'),
  ])
  assert.match(home, /<h1/)
  assert.match(home, /id="features"/)
  assert.doesNotMatch(board, /开启自动轮播|暂停自动轮播|reading-state|阅读时暂停/)
  assert.match(board, /visibilitychange/)
  assert.match(board, /focusout/)
  assert.doesNotMatch(board, /onWheel|preventDefault/)
  assert.match(feedback, /<CreatePanel\s+v-if="!FEEDBACK_AVAILABLE"/)
  assert.match(feedback, /<template v-else>/)
})

test('showcase home, authenticated features and pending footer entries match the requested design', async () => {
  const [nav, home, footer, router] = await Promise.all([
    readFile(new URL('../src/site/components/SiteNav.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/site/pages/HomePage.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/site/components/SiteFooter.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/router/index.js', import.meta.url), 'utf8'),
  ])
  assert.match(nav, /to: '\/', key: 'nav.index'/)
  assert.match(nav, /auth.isLoggedIn && auth.user/)
  assert.match(nav, /background: transparent/)
  assert.match(home, /id="features"/)
  assert.match(home, /<PlayerAccountPanels\s*\/>/)
  assert.doesNotMatch(home, /FlapBoard|loadAnnouncements|ChangelogPanel|RecentComments/)
  assert.match(footer, /v-for="g in FOOTER_GROUPS"/)
  assert.match(footer, /class="pending"/)
  assert.match(router, /requiresAuth: true, title: '功能 · MCTP'/)
  assert.match(router, /requiresAuth: true, title: '个人中心 · MCTP'/)
  assert.match(nav, /if \(route.meta.requiresAuth\) await router.replace\('\/'\)/)
})

test('authentication destinations preserve query and hash through Microsoft callback URLs', async () => {
  const allauth = await server.ssrLoadModule('/src/api/allauth.js')
  const previous = globalThis.window
  const previousStorage = globalThis.sessionStorage
  globalThis.window = { location: { href: 'http://localhost:5173/preview/pr-1/#/login' } }
  const sessionValues = new Map()
  globalThis.sessionStorage = {
    getItem: key => sessionValues.get(key) ?? null,
    removeItem: key => sessionValues.delete(key),
  }
  try {
    const callback = allauth.callbackUrl('/home#account')
    assert.equal(new URLSearchParams(callback.split('?')[1]).get('redirect'), '/home#account')
    assert.equal(new URLSearchParams(allauth.callbackUrl('//outside.invalid').split('?')[1]).get('redirect'), '/home')
    sessionValues.set('mctp-auth-redirect', '/points')
    assert.equal(allauth.consumeCallbackRedirect(), '/points')
    assert.equal(sessionValues.size, 0)
    sessionValues.set('mctp-auth-redirect', '/home#account')
    assert.equal(allauth.consumeCallbackRedirect('/points'), '/points')
    assert.equal(allauth.consumeCallbackRedirect('//outside.invalid'), '/home')
  } finally {
    globalThis.window = previous
    globalThis.sessionStorage = previousStorage
  }
  const [login, register, callback] = await Promise.all([
    readFile(new URL('../src/views/LoginView.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/views/RegisterView.vue', import.meta.url), 'utf8'),
    readFile(new URL('../src/views/MicrosoftCallbackView.vue', import.meta.url), 'utf8'),
  ])
  for (const page of [login, register]) {
    assert.match(page, /router.push\(localRedirect\(route.query.redirect\)\)/)
    assert.match(page, /query: \{ redirect: localRedirect\(route.query.redirect\) \}/)
  }
  assert.match(callback, /router.replace\(destination.value\)/)
})
