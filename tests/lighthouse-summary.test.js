import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizeAssertions } from '../scripts/lighthouse-summary.mjs'

test('summarizeAssertions counts warnings and errors with audit ids', () => {
  const rows = [
    { level: 'warn', auditId: 'total-blocking-time' },
    { level: 'error', auditId: 'largest-contentful-paint' },
    { level: 'warn', auditId: 'total-blocking-time' },
  ]
  assert.equal(
    summarizeAssertions(rows),
    'Lighthouse: 2 warnings, 1 errors (largest-contentful-paint, total-blocking-time)',
  )
})

test('summarizeAssertions degrades without results', () => {
  assert.equal(summarizeAssertions(null), 'Lighthouse: assertion results unavailable')
  assert.equal(summarizeAssertions([]), 'Lighthouse: 0 warnings, 0 errors')
})
