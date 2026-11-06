<script setup>
/**
 * 文件用途：主页面开头板块——悬浮的机械动力风格账号面板
 * 布局：左 1/3 = 头像 + 白色像素名字 + 小一号的像素数字 UID（旁边有复制按钮）；
 *       右 2/3 = 今日运势（FortunePanel，含塔罗星盘）。
 * 主界面要求登录；账号设置跳转本页账号区，积分进入独立明细页。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { errorMessage } from '@/utils/errors'
import CreatePanel from './CreatePanel.vue'
import PixelAvatar from './PixelAvatar.vue'
import FortunePanel from './FortunePanel.vue'
import PixelText from '../PixelText.vue'
import { account, isLoggedIn, isAdmin } from '../../services/account'

const copied = ref(false)
const copyError = ref('')
let copiedTimer
const auth = useAuthStore()
const sessionLoading = ref(false)
const sessionError = ref('')

async function restoreSession() {
  sessionLoading.value = true
  sessionError.value = ''
  try {
    await auth.ensureSession()
  } catch (error) {
    sessionError.value = errorMessage(error, '无法读取玩家资料，请重试')
  } finally {
    sessionLoading.value = false
  }
}

onMounted(restoreSession)
onBeforeUnmount(() => clearTimeout(copiedTimer))

/**
 * 作用：复制 UID 到剪贴板。
 * 原因：navigator.clipboard 只在 https / localhost 下可用，失败时退回到旧的 execCommand 方式。
 */
async function copyUid() {
  copyError.value = ''
  const text = String(account.value.uid)
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      if (!document.execCommand('copy')) throw new Error('Clipboard copy was rejected')
    } catch {
      copyError.value = '无法复制 UID，请手动选择下方编号。'
      return
    } finally {
      ta.remove()
    }
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <section
    class="hero"
    :class="{ 'is-guest': !isLoggedIn }"
    aria-label="账号与今日运势"
  >
    <CreatePanel
      float
      class="panel"
    >
      <div class="grid">
        <!-- 左 1/3：账号 -->
        <div class="who">
          <p
            v-if="sessionLoading"
            role="status"
          >
            正在读取玩家资料…
          </p>
          <div
            v-else-if="sessionError"
            role="alert"
          >
            <p>{{ sessionError }}</p>
            <button
              type="button"
              class="mc-btn"
              @click="restoreSession"
            >
              重试
            </button>
          </div>
          <template v-else-if="isLoggedIn">
            <PixelAvatar
              :uid="account.uid"
              :src="account.avatar || ''"
              :size="128"
            />
            <div class="name">
              <PixelText
                :text="account.name"
                :px="3"
              />
            </div>
            <div class="uid">
              <PixelText
                :text="`UID ${account.uid}`"
                :px="2"
              />
              <button
                type="button"
                class="copy"
                :aria-label="copied ? '已复制' : '复制 UID'"
                :title="copied ? '已复制' : '复制 UID'"
                @click="copyUid"
              >
                <!-- 像素"两张叠放的纸"复制图标 -->
                <svg
                  v-if="!copied"
                  viewBox="0 0 10 10"
                  shape-rendering="crispEdges"
                >
                  <path
                    d="M3 0h7v7h-2v-1h1v-5h-5v1h-1z"
                    fill="currentColor"
                  />
                  <path
                    d="M0 3h7v7h-7zM1 4v5h5v-5z"
                    fill="currentColor"
                  />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 10 10"
                  shape-rendering="crispEdges"
                >
                  <path
                    d="M8 2h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <span
                class="toast"
                :class="{ show: copied }"
              >已复制</span>
            </div>
            <p
              v-if="copyError"
              role="alert"
            >
              {{ copyError }} {{ account.uid }}
            </p>
            <span
              v-if="isAdmin"
              class="badge"
            >管理员</span>
            <div class="account-actions">
              <router-link
                to="/home#account"
                class="mc-btn is-ghost"
              >账号设置</router-link>
              <router-link
                to="/points"
                class="mc-btn is-ghost"
              >我的积分</router-link>
            </div>
          </template>
          <template v-else>
            <PixelAvatar
              locked
              :size="128"
            />
            <div class="name">
              <PixelText
                text="未登录"
                :px="3"
              />
            </div>
            <p class="tip">
              无需登录即可浏览社区公告。
            </p>
            <router-link
              :to="{ path: '/login', query: { redirect: '/home' } }"
              class="mc-btn"
            ><PixelText
              text="登录"
              :px="2"
            /></router-link>
          </template>
        </div>

        <!-- 右 2/3：今日运势 -->
        <div class="luck">
          <div
            v-if="!isLoggedIn"
            class="guest-intro"
          >
            <h2>
              <PixelText
                text="欢迎来到社区"
                :px="2"
              />
            </h2>
            <p>查看最新公告，了解机械动力玩家社区。</p>
            <p class="tip">
              登录后可使用社区功能、管理账号、查看积分与今日运势。
            </p>
          </div>
          <FortunePanel
            v-else
            :uid="account?.uid ?? null"
            :locked="!isLoggedIn"
          />
        </div>
      </div>
    </CreatePanel>
  </section>
</template>

<style scoped>
.hero {
  width: min(var(--site-width), 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}
.panel {
  width: min(1120px, 100%);
}
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  min-height: 340px;
}
.is-guest .grid { min-height: 0; }
.is-guest :deep(.pixel-avatar) { width: 72px !important; height: 72px !important; }
.is-guest .who { padding: 24px 20px; gap: 12px; }
.guest-intro { display: grid; gap: 12px; align-content: center; height: 100%; font-family: var(--font-body); font-size: 14px; line-height: 1.7; }
.guest-intro p { margin: 0; }
.name { max-width: 100%; }
.name :deep(svg) { max-width: 100%; height: auto; }
.who {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 36px 20px;
  border-right: 3px solid var(--outline);
  box-shadow: 3px 0 0 #45464b;
  text-align: center;
}
.name {
  color: #fff;
  margin-top: 10px;
}
.uid {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
}
.copy {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  background: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}
.copy:hover { color: var(--brass-hi); }
.copy svg { width: 16px; height: 16px; }
.toast {
  position: absolute;
  left: 100%;
  margin-left: 6px;
  font-size: 12px;
  color: #80c71f;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}
.toast.show { opacity: 1; }
.badge {
  padding: 2px 8px;
  font-size: 12px;
  color: #3a2208;
  background: var(--brass);
  box-shadow: 0 0 0 2px var(--outline);
}
.account-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
.account-actions .mc-btn { min-height: 44px; }
.tip {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
}
.luck {
  padding: 28px clamp(18px, 3vw, 36px);
  min-width: 0;
}
@media (max-width: 800px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .who {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 12px 20px;
    text-align: left;
    border-right: 0;
    box-shadow: none;
    border-bottom: 3px solid var(--outline);
    padding: 24px 16px;
  }
  .who :deep(.pixel-avatar) { width: 72px !important; height: 72px !important; grid-column: 1; grid-row: 1 / span 3; }
  .who .name, .who .uid, .who .badge { grid-column: 2; margin: 0; justify-self: start; }
  .who .account-actions, .who > p, .who > div[role="alert"] { grid-column: 1 / -1; }
  .copy { width: 44px; height: 44px; }
  .is-guest .who { display: grid; grid-template-columns: auto 1fr; gap: 8px 20px; text-align: left; }
  .is-guest .who :deep(.pixel-avatar) { grid-row: span 3; }
  .is-guest .who .name { margin: 0; }
  .is-guest .who .mc-btn { justify-self: start; }
  .is-guest .luck { padding: 20px; }
}
</style>
