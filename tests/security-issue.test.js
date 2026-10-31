import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildIssueBody,
  isClean,
  MARKERS,
  summarizeNpm,
  summarizePip,
} from '../scripts/security-issue.mjs'

test('summarizeNpm reads severity counts and fix suggestions', () => {
  const report = {
    metadata: { vulnerabilities: { info: 0, low: 1, moderate: 2, high: 1, critical: 0, total: 4 } },
    vulnerabilities: {
      minimatch: { name: 'minimatch', severity: 'moderate', isDirect: false, fixAvailable: { name: 'eslint', version: '4.0.0' } },
      'form-data': { name: 'form-data', severity: 'high', isDirect: true, fixAvailable: false },
      ignored: { name: 'ignored', severity: 'info' },
    },
  }
  const summary = summarizeNpm(report)
  assert.equal(summary.total, 4)
  assert.deepEqual(summary.packages.map((item) => item.name), ['form-data', 'minimatch'])
  assert.equal(summary.packages[0].fix, '无自动修复')
  assert.equal(summary.packages[1].fix, 'eslint@4.0.0')
})

test('summarizePip flattens and deduplicates vulnerabilities', () => {
  const report = {
    dependencies: [
      { name: 'pyjwt', version: '2.12.1', vulns: [{ id: 'PYSEC-1', fix_versions: ['2.15.0'] }] },
      { name: 'urllib3', version: '2.6.3', vulns: [{ id: 'PYSEC-2', fixed_versions: ['2.8.0'] }] },
      { name: 'safe', version: '1.0.0', vulns: [] },
    ],
  }
  const summary = summarizePip(report)
  assert.equal(summary.total, 2)
  assert.deepEqual(summary.packages, [
    { name: 'pyjwt', version: '2.12.1', id: 'PYSEC-1', fix: '2.15.0' },
    { name: 'urllib3', version: '2.6.3', id: 'PYSEC-2', fix: '2.8.0' },
  ])
})

test('buildIssueBody includes marker, totals, rows and report hint', () => {
  const body = buildIssueBody({
    marker: MARKERS.backend,
    title: '[安全巡检] 后端依赖漏洞（2 项）',
    source: 'pip-audit',
    total: 2,
    rows: [
      { name: 'pyjwt', version: '2.12.1', id: 'PYSEC-1', fix: '2.15.0' },
      { name: 'urllib3', version: '2.6.3', id: 'PYSEC-2', fix: '2.8.0' },
    ],
    buildUrl: 'http://jenkins/job/MCTP-FE-Dependency/1/',
  })
  assert.ok(body.startsWith(MARKERS.backend))
  assert.match(body, /检测到 \*\*2\*\* 项/)
  assert.match(body, /\| pyjwt \| 2\.12\.1 \| PYSEC-1 \| 2\.15\.0 \|/)
  assert.match(body, /本 Issue 由 `MCTP-FE-Dependency`/)
})

test('buildIssueBody truncates long tables', () => {
  const rows = Array.from({ length: 60 }, (_, index) => ({
    name: `pkg-${index}`,
    version: '1.0.0',
    id: `ID-${index}`,
    fix: '2.0.0',
  }))
  const body = buildIssueBody({
    marker: MARKERS.frontend,
    title: 't',
    source: 'npm audit',
    total: 60,
    rows,
  })
  assert.match(body, /仅列出前 50 条/)
  assert.equal(body.includes('pkg-59'), false)
})

test('isClean only when both summaries are empty', () => {
  assert.equal(isClean({ total: 0 }, { total: 0 }), true)
  assert.equal(isClean({ total: 1 }, { total: 0 }), false)
  assert.equal(isClean({ total: 0 }, { total: 1 }), false)
})
