// 专属转场的挑选规则（src/site/transitions/index.js）与 whenTransitionDone 的等待逻辑
import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const { pickTransition } = await server.ssrLoadModule('/src/site/transitions/index.js')
const transition = await server.ssrLoadModule('/src/site/composables/usePageTransition.js')

after(() => server.close())

const at = (path) => ({ path })

test('special pages pick their own transition, entering first then leaving', () => {
  assert.equal(pickTransition(at('/login'), at('/home')), 'binary')
  assert.equal(pickTransition(at('/register'), at('/login')), 'binary')
  assert.equal(pickTransition(at('/points'), at('/home')), 'shutter')
  assert.equal(pickTransition(at('/home/f/modpack'), at('/home')), 'crate')
  assert.equal(pickTransition(at('/home/f/blueprints'), at('/home')), 'blueprint')
  assert.equal(pickTransition(at('/home/f/mods'), at('/home')), 'blackhole')
  assert.equal(pickTransition(at('/home/f/gallery'), at('/home')), 'melt')
  assert.equal(pickTransition(at('/home/f/banlist'), at('/home')), 'portal')
  assert.equal(pickTransition(at('/home/f/history'), at('/home')), 'iris')
  // 离开专属页面回到普通页面，也用离开那一页的转场
  assert.equal(pickTransition(at('/home'), at('/home/f/mods')), 'blackhole')
})

test('ordinary pages keep the short page transition', () => {
  assert.equal(pickTransition(at('/home'), at('/')), null)
  assert.equal(pickTransition(at('/feedback'), at('/home')), null)
  assert.equal(pickTransition(at('/announcements'), at('/home')), null)
  assert.equal(pickTransition(at('/home/f/unknown'), at('/home')), null)
  assert.equal(pickTransition(at('/legal/terms'), at('/home')), null)
})

test('reduced motion always falls back to the short page transition', () => {
  const previous = globalThis.window
  globalThis.window = { matchMedia: () => ({ matches: true }) }
  try {
    assert.equal(pickTransition(at('/login'), at('/home')), null)
    assert.equal(pickTransition(at('/home/f/mods'), at('/home')), null)
  } finally {
    globalThis.window = previous
  }
})

test('whenTransitionDone also waits for a running special transition', async () => {
  let finish
  const effect = new Promise((resolve) => (finish = resolve))
  transition.setEffectRunning(effect)
  assert.equal(transition.isTransitionRunning(), true)
  let done = false
  const waiting = transition.whenTransitionDone().then(() => (done = true))
  await Promise.resolve()
  assert.equal(done, false)
  finish()
  await waiting
  assert.equal(done, true)
  await Promise.resolve()
  assert.equal(transition.isTransitionRunning(), false)
})
