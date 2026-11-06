/**
 * 文件用途：保存浏览器本地的娱乐运势抽牌记录
 * 原因：隐私模式、存储被禁用或空间写满时，localStorage 会直接抛错；
 *       这里统一 try/catch，读不到就返回默认值，写不进就返回 false，页面照常运行。
 */
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
