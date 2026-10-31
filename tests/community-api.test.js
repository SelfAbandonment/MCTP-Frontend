import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createPinia, setActivePinia } from 'pinia'

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const { communityApi } = await server.ssrLoadModule('/src/api/community.js')
const { default: api } = await server.ssrLoadModule('/src/api/axios.js')
after(() => server.close())

setActivePinia(createPinia())

function capture() {
  const calls = []
  api.defaults.adapter = async (config) => {
    calls.push({
      method: (config.method || 'get').toLowerCase(),
      url: config.url,
      params: config.params,
      authorization: config.headers?.get?.('Authorization') ?? config.headers?.Authorization ?? null,
    })
    return {
      data: { code: 200, message: 'success', data: { results: [], count: 0, next: null, previous: null } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  }
  return calls
}

test('public announcement detail keeps the v1 path and skips auth', async () => {
  const calls = capture()
  await communityApi.announcement(7)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].method, 'get')
  assert.equal(calls[0].url, '/api/v1/announcements/7/')
  assert.equal(calls[0].authorization, null)
})

test('public announcement list forwards search and page', async () => {
  const calls = capture()
  await communityApi.announcements({ page: 2, search: '开服' })
  assert.deepEqual(calls[0].params, { page: 2, search: '开服' })
  assert.equal(calls[0].url, '/api/v1/announcements/')
})

test('public announcement list forwards the category filter', async () => {
  const calls = capture()
  await communityApi.announcements({ category: 'event' })
  assert.deepEqual(calls[0].params, { category: 'event' })
  assert.equal(calls[0].authorization, null)
})

test('overview uses the authenticated endpoint', async () => {
  const calls = capture()
  await communityApi.overview()
  assert.equal(calls[0].url, '/api/v1/overview/')
})
