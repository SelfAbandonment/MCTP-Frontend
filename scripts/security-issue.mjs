#!/usr/bin/env node
// 把依赖巡检结果同步成 GitHub Issue：有漏洞则新建/更新，清零则关闭旧 Issue。
// 输入：npm-audit.json（前端）、pip-audit.json（后端，可能不存在）。
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

export const MARKERS = {
  frontend: '<!-- mctp-security-audit:frontend -->',
  backend: '<!-- mctp-security-audit:backend -->',
}

const SEVERITY_ORDER = ['critical', 'high', 'moderate', 'low', 'info']

export function summarizeNpm(report) {
  const counts = report?.metadata?.vulnerabilities ?? {}
  const packages = Object.values(report?.vulnerabilities ?? {})
    .filter((item) => item?.severity && item.severity !== 'info')
    .map((item) => ({
      name: item.name,
      severity: item.severity,
      fix: item.fixAvailable
        ? `${item.fixAvailable.name ?? item.name}@${item.fixAvailable.version ?? ''}`.replace(/@$/, '')
        : '无自动修复',
    }))
    .sort((left, right) => SEVERITY_ORDER.indexOf(left.severity) - SEVERITY_ORDER.indexOf(right.severity))
  const total = SEVERITY_ORDER.reduce((sum, key) => sum + (Number(counts[key]) || 0), 0)
  return { total, counts, packages }
}

export function summarizePip(report) {
  const rows = []
  for (const dependency of report?.dependencies ?? []) {
    for (const vuln of dependency.vulns ?? []) {
      const fixes = vuln.fix_versions ?? vuln.fixed_versions ?? []
      rows.push({
        name: dependency.name,
        version: dependency.version,
        id: vuln.id,
        fix: fixes.length ? fixes.join(', ') : '无',
      })
    }
  }
  const unique = [...new Map(rows.map((row) => [`${row.name}:${row.id}`, row])).values()]
  return { total: unique.length, packages: unique }
}

export function buildIssueBody({ marker, title, source, total, rows, buildUrl }) {
  const sections = [marker, `### ${title}`, '']
  sections.push(`- 检测到 **${total}** 项已知依赖漏洞（${source}）`)
  if (buildUrl) sections.push(`- 巡检构建：${buildUrl}`)
  sections.push('')
  if (rows.length) {
    sections.push('| 包 | 版本 | 漏洞 / 严重级别 | 修复版本 |')
    sections.push('| --- | --- | --- | --- |')
    for (const row of rows.slice(0, 50)) {
      sections.push(`| ${row.name} | ${row.version ?? '-'} | ${row.id ?? row.severity} | ${row.fix} |`)
    }
    if (rows.length > 50) sections.push('')
    if (rows.length > 50) sections.push(`> 仅列出前 50 条，完整报告见 Jenkins 构建产物。`)
  }
  sections.push('')
  sections.push('> 本 Issue 由 `MCTP-FE-Dependency` 每周巡检自动维护：漏洞清零后会自动关闭。')
  return sections.join('\n')
}

export function isClean(frontend, backend) {
  return frontend.total === 0 && backend.total === 0
}

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

async function github(path, init, token) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'mctp-jenkins',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`GitHub ${response.status}: ${body.slice(0, 300)}`)
  }
  return response.json()
}

async function findOpenIssue(repo, marker, token) {
  const issues = await github(`/repos/${repo}/issues?state=open&per_page=100`, {}, token)
  return issues.find((issue) => !issue.pull_request && issue.body?.includes(marker)) ?? null
}

async function syncIssue({ repo, marker, title, source, summary, buildUrl, token }) {
  const existing = await findOpenIssue(repo, marker, token)
  if (summary.total === 0) {
    if (existing) {
      await github(
        `/repos/${repo}/issues/${existing.number}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ state: 'closed' }),
        },
        token,
      )
      console.log(`${repo}：漏洞已清零，关闭 Issue #${existing.number}`)
    } else {
      console.log(`${repo}：没有漏洞，无需开 Issue`)
    }
    return
  }
  const body = buildIssueBody({
    marker,
    title,
    source,
    total: summary.total,
    rows: summary.packages,
    buildUrl,
  })
  if (existing) {
    await github(
      `/repos/${repo}/issues/${existing.number}`,
      { method: 'PATCH', body: JSON.stringify({ title, body }) },
      token,
    )
    console.log(`${repo}：已更新 Issue #${existing.number}`)
    return
  }
  const created = await github(
    `/repos/${repo}/issues`,
    { method: 'POST', body: JSON.stringify({ title, body }) },
    token,
  )
  console.log(`${repo}：已新建 Issue #${created.number}`)
}

async function main() {
  const token = process.env.GH_TOKEN
  if (!token) {
    console.log('缺少 GH_TOKEN，跳过巡检 Issue 同步')
    return
  }
  const buildUrl = process.env.BUILD_URL ?? ''
  const frontend = summarizeNpm(readJson('npm-audit.json'))
  const backend = summarizePip(readJson('pip-audit.json'))
  console.log(`前端 npm：${frontend.total} 项；后端 pip：${backend.total} 项`)
  await syncIssue({
    repo: process.env.GH_REPO_FE ?? 'SelfAbandonment/MCTP-Frontend',
    marker: MARKERS.frontend,
    title: `[安全巡检] 前端依赖漏洞（${frontend.total} 项）`,
    source: 'npm audit',
    summary: frontend,
    buildUrl,
    token,
  })
  await syncIssue({
    repo: process.env.GH_REPO_API ?? 'SelfAbandonment/MCTP-API',
    marker: MARKERS.backend,
    title: `[安全巡检] 后端依赖漏洞（${backend.total} 项）`,
    source: 'pip-audit',
    summary: backend,
    buildUrl,
    token,
  })
  console.log(isClean(frontend, backend) ? '巡检完成：无已知漏洞' : '巡检完成：存在待修复漏洞')
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === entry) {
  main().catch((error) => console.log(`巡检 Issue 同步失败（不影响构建结果）：${error.message}`))
}
