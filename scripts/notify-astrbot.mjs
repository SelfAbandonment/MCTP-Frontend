#!/usr/bin/env node
// 把 Jenkins 构建结果推给 AstrBot 插件；凭证缺失或网络失败时只记录，不阻断构建。
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const PLUGIN = 'astrbot_plugin_mctp_ci'
const DEFAULT_PATH = `/api/v1/plugins/extensions/${PLUGIN}/webhook`
const STATUSES = new Set(['failure', 'success', 'warning', 'fixed', 'info'])

function trim(value) {
  return String(value ?? '').trim()
}

function normalizeStatus(value) {
  const status = trim(value).toLowerCase()
  return STATUSES.has(status) ? status : 'info'
}

export function buildPayload(env = process.env) {
  const base = trim(env.ASTRBOT_BASE_URL).replace(/\/+$/, '')
  const apiKey = trim(env.ASTRBOT_API_KEY)
  const token = trim(env.ASTRBOT_WEBHOOK_TOKEN)
  const path = trim(env.ASTRBOT_WEBHOOK_PATH) || DEFAULT_PATH
  const details = trim(env.NOTIFY_DETAILS)
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)

  const payload = {
    repo: trim(env.NOTIFY_REPO) || 'MCTP-FE',
    event: trim(env.NOTIFY_EVENT) || 'ci',
    status: normalizeStatus(env.NOTIFY_STATUS),
    title: trim(env.NOTIFY_TITLE) || 'MCTP-FE 构建通知',
    subtitle: trim(env.NOTIFY_SUBTITLE),
    branch: trim(env.NOTIFY_BRANCH),
    pr: trim(env.NOTIFY_PR),
    actor: trim(env.NOTIFY_ACTOR),
    commit: trim(env.NOTIFY_COMMIT),
    duration: trim(env.NOTIFY_DURATION),
    details,
    url: trim(env.NOTIFY_URL),
    time: new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      hour12: false,
    }),
  }
  return { base, apiKey, token, path, payload }
}

export async function sendNotification(env = process.env, fetchImpl = fetch) {
  const { base, apiKey, token, path, payload } = buildPayload(env)
  const missing = []
  if (!base) missing.push('ASTRBOT_BASE_URL')
  if (!apiKey) missing.push('ASTRBOT_API_KEY')
  if (!token) missing.push('ASTRBOT_WEBHOOK_TOKEN')
  if (missing.length) {
    return { skipped: true, reason: `缺少 ${missing.join(', ')}` }
  }

  const response = await fetchImpl(`${base}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-CI-Token': token,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  })
  const text = (await response.text()).slice(0, 300)
  if (!response.ok) {
    throw new Error(`AstrBot 返回 HTTP ${response.status}: ${text}`)
  }
  return { skipped: false, status: response.status, body: text }
}

async function main() {
  try {
    const result = await sendNotification()
    if (result.skipped) {
      console.log(`AstrBot 通知跳过：${result.reason}`)
    } else {
      console.log(`AstrBot 通知已发送：HTTP ${result.status} ${result.body}`)
    }
  } catch (error) {
    console.log(`AstrBot 通知失败（不影响构建）：${error.message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
