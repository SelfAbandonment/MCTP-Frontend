import { ref, watch } from 'vue'

export const LANGS = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en', name: 'English' },
]
const MESSAGES = {
  'zh-CN': { 'nav.index': '首页', 'nav.home': '个人中心', 'nav.announcements': '公告', 'nav.features': '功能', 'nav.feedback': '反馈' },
  en: { 'nav.index': 'Home', 'nav.home': 'My account', 'nav.announcements': 'News', 'nav.features': 'Features', 'nav.feedback': 'Feedback' },
}
const STORE_KEY = 'mctp-locale'
function readSaved() {
  try {
    const value = localStorage.getItem(STORE_KEY)
    return LANGS.some((language) => language.code === value) ? value : null
  } catch {
    return null
  }
}
export const locale = ref(readSaved() || 'zh-CN')
export function setLocale(code) {
  if (!LANGS.some((language) => language.code === code)) return
  locale.value = code
  try {
    localStorage.setItem(STORE_KEY, code)
  } catch {
    // Private browsing may disallow persisting the navigation preference.
  }
}
export function t(key) {
  return MESSAGES[locale.value]?.[key] ?? MESSAGES['zh-CN'][key] ?? key
}
// Only navigation is translated; the page body remains Chinese.
watch(locale, () => {
  document.documentElement.lang = 'zh-CN'
}, { immediate: true })
