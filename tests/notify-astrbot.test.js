import test from 'node:test'
import assert from 'node:assert/strict'
import { buildPayload, sendNotification } from '../scripts/notify-astrbot.mjs'

const ENV = {
  ASTRBOT_BASE_URL: 'http://127.0.0.1:6185/',
  ASTRBOT_API_KEY: 'abk_test',
  ASTRBOT_WEBHOOK_TOKEN: 'hook-token',
  NOTIFY_REPO: 'MCTP-FE',
  NOTIFY_EVENT: 'ci',
  NOTIFY_STATUS: 'failure',
  NOTIFY_TITLE: '构建失败',
  NOTIFY_SUBTITLE: 'feat/x → develop',
  NOTIFY_BRANCH: 'feat/x',
  NOTIFY_PR: '49',
  NOTIFY_DETAILS: 'lint 通过 | test 失败 | ',
  NOTIFY_URL: 'https://jenkins/job/1',
}

test('buildPayload maps env and trims base/details', () => {
  const { base, path, payload } = buildPayload(ENV)
  assert.equal(base, 'http://127.0.0.1:6185')
  assert.equal(path, '/api/v1/plugins/extensions/astrbot_plugin_mctp_ci/webhook')
  assert.equal(payload.status, 'failure')
  assert.deepEqual(payload.details, ['lint 通过', 'test 失败'])
  assert.equal(payload.pr, '49')
})

test('buildPayload falls back to info for unknown status', () => {
  const { payload } = buildPayload({ ...ENV, NOTIFY_STATUS: 'boom' })
  assert.equal(payload.status, 'info')
})

test('sendNotification skips when config is missing', async () => {
  const result = await sendNotification({})
  assert.equal(result.skipped, true)
  assert.match(result.reason, /ASTRBOT_BASE_URL/)
})

test('sendNotification posts JSON with auth headers', async () => {
  let captured
  const fetchImpl = async (url, options) => {
    captured = { url, options }
    return { ok: true, status: 200, text: async () => '{"ok":true,"sent":1}' }
  }
  const result = await sendNotification(ENV, fetchImpl)
  assert.equal(result.skipped, false)
  assert.equal(captured.url, 'http://127.0.0.1:6185/api/v1/plugins/extensions/astrbot_plugin_mctp_ci/webhook')
  assert.equal(captured.options.headers.Authorization, 'Bearer abk_test')
  assert.equal(captured.options.headers['X-CI-Token'], 'hook-token')
  const body = JSON.parse(captured.options.body)
  assert.equal(body.title, '构建失败')
  assert.equal(body.status, 'failure')
})

test('sendNotification throws on non-2xx', async () => {
  const fetchImpl = async () => ({ ok: false, status: 403, text: async () => 'forbidden' })
  await assert.rejects(() => sendNotification(ENV, fetchImpl), /HTTP 403/)
})
