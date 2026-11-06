/**
 * 文件用途：反馈页"书与笔"的提交
 * 现状：后端尚未提供反馈接口，界面保留但提交明确禁用，不保存本地假反馈。
 * 接入真实后端时：MCTP-API 目前没有反馈接口，建议新增
 *   POST /api/v1/feedback/  （multipart/form-data）
 *     category        bug | suggestion | report | appeal | other
 *     custom_category 选"其他"时的自定义分类
 *     reported_uid    被举报账号 UID（选填）
 *     content         反馈内容（必填）
 *     screenshots[]   截图文件（选填，最多 3 张）
 * 然后把 submitFeedback 内部换成请求即可。
 */
export const FEEDBACK_AVAILABLE = false
export const FEEDBACK_UNAVAILABLE = '反馈提交尚未开放：后端接口正在准备中，请通过站点交流渠道联系管理员。'

export const CATEGORIES = [
  { value: 'bug', label: 'Bug' },
  { value: 'suggestion', label: '建议' },
  { value: 'report', label: '举报' },
  { value: 'appeal', label: '申诉' },
  { value: 'other', label: '其他' },
]
export const MAX_SHOTS = 3
export const MAX_SHOT_MB = 5
export const MAX_CONTENT = 1000

/** 作用：校验表单，返回 { 字段名: 错误提示 }（空对象 = 通过） */
export function validateFeedback(f) {
  const e = {}
  if (!CATEGORIES.some((c) => c.value === f.category)) e.category = '请选择反馈分类'
  if (f.category === 'other' && !f.customCategory.trim()) e.customCategory = '请填写自定义分类'
  if (f.reportedUid && !/^\d{1,12}$/.test(f.reportedUid.trim())) e.reportedUid = 'UID 只能是数字'
  if (!f.content.trim()) e.content = '请填写反馈内容'
  else if (f.content.length > MAX_CONTENT) e.content = `内容不能超过 ${MAX_CONTENT} 字`
  return e
}

export async function submitFeedback() {
  throw new Error(FEEDBACK_UNAVAILABLE)
}
