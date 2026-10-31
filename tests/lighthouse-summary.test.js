import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildSummary,
  summarizeAssertions,
  summarizeScores,
} from '../scripts/lighthouse-summary.mjs'

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

const lhr = (performance, accessibility, bestPractices, seo) => ({
  categories: {
    performance: { score: performance },
    accessibility: { score: accessibility },
    'best-practices': { score: bestPractices },
    seo: { score: seo },
  },
})

test('summarizeScores takes the median of each category', () => {
  const scores = summarizeScores([
    lhr(0.9, 1, 0.95, 0.8),
    lhr(0.8, 1, 0.9, 0.7),
    lhr(1, 1, 1, 1),
  ])
  assert.equal(scores, '性能 90 · 无障碍 100 · 最佳实践 95 · SEO 80')
})

test('summarizeScores returns empty text without reports', () => {
  assert.equal(summarizeScores([]), '')
  assert.equal(summarizeScores(null), '')
})

test('buildSummary combines scores and assertion output', () => {
  const summary = buildSummary(
    [{ level: 'warn', auditId: 'total-blocking-time' }],
    [lhr(0.92, 1, 0.96, 0.9)],
  )
  assert.equal(
    summary,
    'Lighthouse 性能 92 · 无障碍 100 · 最佳实践 96 · SEO 90；1 warnings, 0 errors (total-blocking-time)',
  )
  assert.equal(buildSummary(null, [lhr(0.9, 1, 0.9, 0.9)]), 'Lighthouse 性能 90 · 无障碍 100 · 最佳实践 90 · SEO 90')
  assert.equal(buildSummary(null, []), 'Lighthouse: assertion results unavailable')
})
