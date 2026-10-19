import test from 'node:test'
import assert from 'node:assert/strict'
import { errorMessage, fieldErrors, localRedirect, formatDate } from '../src/utils/errors.js'

test('request failures produce explicit useful messages', () => {
  assert.equal(errorMessage({ code: 'ECONNABORTED' }), '请求超时，请稍后重试')
  assert.match(errorMessage({ message: 'Network Error' }), /无法连接/)
  assert.match(errorMessage({ response: { status: 403 } }), /权限/)
  assert.match(errorMessage({ response: { status: 401 } }), /重新登录/)
  assert.equal(errorMessage({ response: { status: 400, data: { message: 'invalid' } } }), 'invalid')
})

test('validation envelope displays array and scalar field messages', () => {
  assert.deepEqual(fieldErrors({ response: { data: { data: { title: ['a', 'b'], body: 'c' } } } }), {
    title: 'a；b', body: 'c',
  })
  assert.deepEqual(fieldErrors({ response: { data: { data: null } } }), {})
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
