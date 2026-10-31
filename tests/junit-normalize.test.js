import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeJunit } from '../scripts/junit-normalize.mjs'

const BARE = `<?xml version="1.0" encoding="utf-8"?>
<testsuites>
	<testcase name="a" time="0.5" classname="test"/>
	<testcase name="b" time="1.25" classname="test">
		<failure message="boom"/>
	</testcase>
</testsuites>
`

test('wraps bare testcases in a testsuite with counts and total time', () => {
  const xml = normalizeJunit(BARE)
  assert.match(xml, /<testsuite name="mctp-frontend" tests="2" failures="1" errors="0" skipped="0" time="1.750">/)
  assert.match(xml, /<testcase name="a"/)
  assert.match(xml, /<\/testsuites>/)
})

test('leaves already normalized or malformed documents untouched', () => {
  const normalized = '<testsuites><testsuite name="x" tests="1"><testcase name="a"/></testsuite></testsuites>'
  assert.equal(normalizeJunit(normalized), normalized)
  assert.equal(normalizeJunit('not xml'), 'not xml')
})
