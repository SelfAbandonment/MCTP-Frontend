import test from 'node:test'
import assert from 'node:assert/strict'
import { errorMessage, fieldErrors, formatDate, formatDay, isNotFound, localRedirect } from '../src/utils/errors.js'

test('request failures produce explicit useful messages', () => {
  assert.equal(errorMessage({ code: 'ECONNABORTED' }), '请求超时，请稍后重试')
  assert.match(errorMessage({ message: 'Network Error' }), /无法连接/)
  assert.match(errorMessage({ response: { status: 403 } }), /权限/)
  assert.match(errorMessage({ response: { status: 401 } }), /重新登录/)
  assert.equal(errorMessage({ response: { status: 400, data: { message: 'validation error' } } }), '提交内容有误，请检查标红的字段')
})

test('backend English messages are localized instead of leaking through', () => {
  const cases = [
    [{ message: 'resource not found' }, /找不到请求的内容/],
    [{ message: 'permission denied' }, /权限/],
    [{ message: 'no microsoft account bound' }, /还没有绑定微软账号/],
    [{ message: 'internal server error' }, /服务暂时不可用/],
    [{ detail: 'authentication required' }, /重新登录/],
  ]
  for (const [data, expected] of cases) {
    assert.match(errorMessage({ response: { status: 400, data } }, '回退文案'), expected)
  }
  // Unknown English copy must not reach the UI as-is.
  assert.equal(errorMessage({ response: { status: 400, data: { message: 'some unexpected english' } } }, '回退文案'), '回退文案')
  // Chinese copy from the backend (e.g. SafeTokenRefreshView) is kept.
  assert.equal(errorMessage({ response: { status: 401, data: { message: '登录已失效，请重新登录' } } }), '登录已失效，请重新登录')
})

test('validation envelope displays array and scalar field messages', () => {
  assert.deepEqual(fieldErrors({ response: { data: { data: { title: ['a', 'b'], body: 'c' } } } }), {
    title: 'a；b', body: 'c',
  })
  assert.deepEqual(fieldErrors({ response: { data: { data: null } } }), {})
})

test('field errors translate the common DRF wording', () => {
  assert.deepEqual(
    fieldErrors({
      response: {
        data: {
          data: {
            title: ['This field is required.'],
            body: ['This field may not be blank.'],
            email: 'Enter a valid email address.',
            old_password: ['old password is incorrect'],
          },
        },
      },
    }),
    { title: '这一项必填', body: '这一项不能为空', email: '邮箱格式不正确', old_password: '当前密码不正确' },
  )
})

test('login redirects stay within the local router', () => {
  for (const invalid of ['https://example.com', '//example.com', '/\\example.com', ['dashboard'], null]) {
    assert.equal(localRedirect(invalid), '/dashboard')
  }
  assert.equal(localRedirect('/manage/players?search=a'), '/manage/players?search=a')
})

test('dates are safe for missing or invalid values', () => {
  assert.equal(formatDate(null), '—')
  assert.equal(formatDate('invalid'), '—')
  assert.notEqual(formatDate('2026-10-17T00:00:00Z'), '—')
})

test('day formatting keeps long Chinese dates and degrades on bad input', () => {
  assert.equal(formatDay(null), '—')
  assert.equal(formatDay('not-a-date'), '—')
  assert.match(formatDay('2026-10-17T00:00:00Z'), /年.*月.*日/)
})

test('only backend 404s count as a missing resource', () => {
  assert.equal(isNotFound({ response: { status: 404 } }), true)
  assert.equal(isNotFound({ response: { status: 403 } }), false)
  assert.equal(isNotFound({ code: 'ERR_CANCELED' }), false)
  assert.equal(isNotFound(undefined), false)
})
