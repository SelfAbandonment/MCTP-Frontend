<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { communityApi } from '@/api/community'
import { errorMessage, fieldErrors, formatDate } from '@/utils/errors'
import { media } from '@/assets/media'

const auth = useAuthStore()
const router = useRouter()
// 场景图回退链：关于图 → 入口图 → 纯 CSS 渐变底，避免素材缺失时出现破图。
const scenePool = [media.about, media.entrance].filter(Boolean)
const sceneIndex = ref(0)
const sceneBroken = ref(scenePool.length === 0)
const sceneSrc = computed(() => scenePool[sceneIndex.value] || '')

function handleSceneError() {
  if (sceneIndex.value < scenePool.length - 1) sceneIndex.value += 1
  else sceneBroken.value = true
}
const email = ref(auth.user?.email || '')
const profileBusy = ref(false)
const profileMessage = ref('')
const profileError = ref('')
const password = ref({ old_password: '', new_password: '', new_password_confirm: '' })
const passwordBusy = ref(false)
const passwordError = ref('')
const passwordErrors = ref({})
const bindingBusy = ref(false)
const bindingError = ref('')
const bindingMessage = ref('')
const confirmUnbind = ref(false)
const health = ref(null)
const healthLoading = ref(false)
const healthError = ref('')
const lastChecked = ref(null)
const healthStatus = computed(() => health.value?.status === 'ok' || health.value?.status === 'healthy')
let timer
let mounted = true

async function saveProfile() {
  profileBusy.value = true
  profileError.value = ''
  profileMessage.value = ''
  try {
    await authApi.updateMe({ email: email.value })
    await auth.fetchMe()
    profileMessage.value = '邮箱已更新'
  } catch (e) {
    profileError.value = fieldErrors(e).email || errorMessage(e, '保存资料失败')
  } finally {
    profileBusy.value = false
  }
}

async function changePassword() {
  passwordError.value = ''
  passwordErrors.value = {}
  if (password.value.new_password !== password.value.new_password_confirm) {
    passwordErrors.value.new_password_confirm = '两次新密码不一致'
    return
  }
  passwordBusy.value = true
  try {
    await authApi.changePassword(password.value)
    auth.logout()
    await router.replace({ path: '/login', query: { passwordChanged: '1' } })
  } catch (e) {
    passwordErrors.value = fieldErrors(e)
    passwordError.value = errorMessage(e, '修改密码失败')
  } finally {
    passwordBusy.value = false
  }
}

async function bind() {
  bindingBusy.value = true
  bindingError.value = ''
  bindingMessage.value = ''
  try {
    await auth.microsoftLogin()
  } catch (e) {
    bindingError.value = errorMessage(e, '无法发起微软绑定')
    bindingBusy.value = false
  }
}

async function unbind() {
  bindingBusy.value = true
  bindingError.value = ''
  bindingMessage.value = ''
  try {
    await authApi.microsoftUnbind()
    await auth.fetchMe()
    bindingMessage.value = '我的世界账号已解绑'
    confirmUnbind.value = false
  } catch (e) {
    bindingError.value = errorMessage(e, '解绑失败')
  } finally {
    bindingBusy.value = false
  }
}

async function checkHealth() {
  if (healthLoading.value) return
  healthLoading.value = true
  try {
    const res = await communityApi.health()
    if (!mounted) return
    health.value = res.data.data
    healthError.value = ''
  } catch (e) {
    if (!mounted) return
    healthError.value = errorMessage(e, '暂时无法读取服务状态')
    health.value = null
  } finally {
    if (mounted) {
      healthLoading.value = false
      lastChecked.value = new Date().toISOString()
    }
  }
}

onMounted(() => {
  checkHealth()
  timer = setInterval(() => {
    if (!document.hidden) checkHealth()
  }, 30000)
})
onUnmounted(() => {
  mounted = false
  clearInterval(timer)
})
</script>

<template>
  <section class="player-welcome">
    <img
      v-if="!sceneBroken"
      class="player-welcome__scene"
      :src="sceneSrc"
      alt=""
      aria-hidden="true"
      @error="handleSceneError"
    >
    <div
      class="player-welcome__veil"
      aria-hidden="true"
    />
    <div
      class="player-welcome__grid"
      aria-hidden="true"
    />
    <span
      class="player-welcome__word"
      aria-hidden="true"
    >玩家</span>
    <div class="player-welcome__copy">
      <p class="eyebrow">
        属于你的角落
      </p>
      <h1>你好，{{ auth.user?.username }}。</h1>
      <p class="player-welcome__sub">
        下一段故事，从你开始。
      </p>
      <RouterLink
        to="/announcements"
        class="welcome-link"
      >
        <span>看看社区的新鲜事</span>
        <span
          class="welcome-link__icon"
          aria-hidden="true"
        >↗</span>
      </RouterLink>
    </div>
  </section>

  <div class="player-grid">
    <section
      class="panel account-panel"
      aria-labelledby="account-title"
    >
      <div class="panel-heading">
        <h2 id="account-title">
          你的账号
        </h2>
        <span class="badge">{{ auth.isStaff ? '社区管理者' : '社区玩家' }}</span>
      </div>
      <dl class="detail-list">
        <div><dt>用户名</dt><dd>{{ auth.user?.username }}</dd></div>
        <div><dt>加入时间</dt><dd>{{ formatDate(auth.user?.date_joined) }}</dd></div>
      </dl>
      <form
        class="account-form"
        @submit.prevent="saveProfile"
      >
        <div class="form-group">
          <label
            class="form-label"
            for="profile-email"
          >邮箱</label>
          <input
            id="profile-email"
            v-model="email"
            class="form-input"
            type="email"
            autocomplete="email"
            maxlength="254"
            required
          >
        </div>
        <p
          v-if="profileError"
          class="alert alert-error"
          role="alert"
        >
          {{ profileError }}
        </p>
        <p
          v-if="profileMessage"
          class="alert alert-success"
          role="status"
        >
          {{ profileMessage }}
        </p>
        <button
          class="btn-secondary"
          type="submit"
          :disabled="profileBusy"
        >
          {{ profileBusy ? '保存中…' : '保存邮箱' }}
        </button>
      </form>
    </section>

    <section
      class="panel minecraft-panel"
      aria-labelledby="minecraft-title"
    >
      <div class="panel-heading">
        <h2 id="minecraft-title">
          我的世界身份
        </h2>
        <span
          class="brand-cube large-cube"
          aria-hidden="true"
        />
      </div>
      <p
        v-if="bindingError"
        class="alert alert-error"
        role="alert"
      >
        {{ bindingError }}
      </p>
      <p
        v-if="bindingMessage"
        class="alert alert-success"
        role="status"
      >
        {{ bindingMessage }}
      </p>
      <template v-if="auth.user?.minecraft">
        <h3 class="minecraft-name">
          {{ auth.user.minecraft.username }}
        </h3>
        <p class="minecraft-uuid">
          {{ auth.user.minecraft.uuid }}
        </p>
        <span class="badge">已绑定</span>
        <div
          v-if="confirmUnbind"
          class="unbind-confirm"
          role="alert"
        >
          <p>确定解绑这个我的世界账号？</p>
          <div class="actions">
            <button
              class="btn-danger"
              :disabled="bindingBusy"
              @click="unbind"
            >
              确认解绑
            </button>
            <button
              class="btn-secondary"
              :disabled="bindingBusy"
              @click="confirmUnbind = false"
            >
              取消
            </button>
          </div>
        </div>
        <button
          v-else
          class="text-button unbind-button"
          @click="confirmUnbind = true"
        >
          解绑账号
        </button>
      </template>
      <template v-else>
        <h3 class="minecraft-name">
          把游戏里的你，带到这里。
        </h3>
        <p class="binding-note">
          使用已拥有我的世界的微软账号完成绑定。
        </p>
        <button
          class="btn-primary"
          :disabled="bindingBusy"
          @click="bind"
        >
          {{ bindingBusy ? '跳转中…' : '绑定微软账号 ↗' }}
        </button>
      </template>
    </section>

    <section
      class="panel"
      aria-labelledby="password-title"
    >
      <div class="panel-heading">
        <h2 id="password-title">
          账号安全
        </h2>
      </div>
      <p class="security-note">
        修改密码后将退出当前登录，请使用新密码重新登录。
      </p>
      <p
        v-if="passwordError"
        class="alert alert-error"
        role="alert"
      >
        {{ passwordError }}
      </p>
      <form @submit.prevent="changePassword">
        <div
          v-for="field in [{key:'old_password',label:'当前密码'}, {key:'new_password',label:'新密码'}, {key:'new_password_confirm',label:'确认新密码'}]"
          :key="field.key"
          class="form-group"
        >
          <label
            :for="`security-${field.key}`"
            class="form-label"
          >{{ field.label }}</label>
          <input
            :id="`security-${field.key}`"
            v-model="password[field.key]"
            class="form-input"
            type="password"
            :autocomplete="field.key === 'old_password' ? 'current-password' : 'new-password'"
            :aria-invalid="!!passwordErrors[field.key]"
            required
          >
          <span
            v-if="passwordErrors[field.key]"
            class="form-error"
          >{{ passwordErrors[field.key] }}</span>
        </div>
        <button
          type="submit"
          class="btn-secondary"
          :disabled="passwordBusy"
        >
          {{ passwordBusy ? '更新中…' : '更新密码' }}
        </button>
      </form>
    </section>

    <section
      class="panel service-panel"
      aria-labelledby="service-title"
    >
      <div class="panel-heading">
        <h2 id="service-title">
          社区服务
        </h2>
        <button
          class="text-button"
          :disabled="healthLoading"
          @click="checkHealth"
        >
          刷新 ↻
        </button>
      </div>
      <p
        v-if="healthError"
        class="alert alert-error"
        role="alert"
      >
        {{ healthError }}
      </p>
      <p class="service-status">
        <span
          class="service-dot"
          :class="{ online: healthStatus && !healthError }"
          aria-hidden="true"
        />
        {{ healthLoading ? '正在检查…' : healthError ? '暂时无法连接' : healthStatus ? '服务连接正常' : '服务状态异常' }}
      </p>
      <p class="security-note">
        这是网站服务状态，并非游戏服务器在线状态。
      </p>
      <dl class="detail-list">
        <div><dt>最近检查</dt><dd>{{ formatDate(lastChecked) }}</dd></div>
        <div><dt>服务版本</dt><dd>{{ health?.version || '—' }}</dd></div>
      </dl>
      <div class="service-links">
        <a
          href="https://docs.qq.com/space/DTXNidGZ1S2FncG9v"
          target="_blank"
          rel="noopener noreferrer"
        >入服指北 ↗</a>
        <RouterLink to="/announcements">
          社区公告 ↗
        </RouterLink>
        <RouterLink
          v-if="auth.isStaff"
          to="/manage"
        >
          进入管理区 ↗
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.player-welcome {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-end;
  min-height: clamp(300px, 36vw, 400px);
  margin-bottom: 26px;
  padding: clamp(26px, 4vw, 52px);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background:
    radial-gradient(ellipse at 84% 12%, #1c30164d 0%, transparent 60%),
    linear-gradient(150deg, #0d140c 0%, #060806 100%);
  box-shadow: 0 30px 90px #00000059;
}

.player-welcome__scene {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.55;
  filter: saturate(0.88) contrast(1.05) brightness(0.72);
  transform: scale(1.03);
}

.player-welcome__veil {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    linear-gradient(92deg, #060806f2 0%, #060806a6 46%, #0608062e 100%),
    linear-gradient(180deg, transparent 42%, #060806d9 100%),
    radial-gradient(circle at 18% 100%, #8ce06a26 0%, transparent 52%);
}

.player-welcome__grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(#f2efe208 1px, transparent 1px),
    linear-gradient(90deg, #f2efe208 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(180deg, #000 0%, transparent 78%);
}

.player-welcome__word {
  position: absolute;
  right: -0.03em;
  top: -0.08em;
  z-index: 0;
  font-family: var(--font-display);
  font-size: clamp(110px, 15vw, 210px);
  line-height: 0.9;
  letter-spacing: 0.02em;
  color: transparent;
  -webkit-text-stroke: 1px #f2efe220;
  pointer-events: none;
  user-select: none;
}

.player-welcome__copy {
  position: relative;
  z-index: 1;
  max-width: min(62ch, 72%);
  overflow-wrap: anywhere;
}

.player-welcome h1 {
  font-family: var(--font-display);
  font-size: clamp(34px, 4.4vw, 62px);
  font-weight: 400;
  line-height: 1.04;
}

.player-welcome__sub {
  margin: 14px 0 24px;
  font-size: 13px;
  color: var(--text-soft);
}

.welcome-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: #ffffff08;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--text-main);
  transition: color 200ms, border-color 200ms, background 200ms, transform 200ms;
}

.welcome-link:hover {
  border-color: var(--brand);
  background: #8ce06a14;
  color: var(--brand);
  transform: translateY(-1px);
}

.welcome-link__icon {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--brand);
}

.player-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; align-items: start; }
.panel-heading h2 {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 400;
  line-height: 1.15;
}
.account-form { margin-top: 22px; }
.minecraft-panel {
  position: relative;
  min-height: 330px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 100% 0%, #16210f5c 0%, transparent 58%),
    linear-gradient(160deg, var(--panel-raised) 0%, var(--panel) 100%);
}
.minecraft-panel::after {
  content: '';
  position: absolute;
  right: -40px;
  bottom: -40px;
  width: 220px;
  height: 220px;
  pointer-events: none;
  background-image:
    linear-gradient(#8ce06a22 1px, transparent 1px),
    linear-gradient(90deg, #8ce06a22 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(circle at center, #000 0%, transparent 72%);
  transform: rotate(-8deg);
}
.brand-cube {
  display: inline-block;
  width: 22px;
  height: 25px;
  flex-shrink: 0;
  background: linear-gradient(150deg, #9be378 0 45%, #62be46 46% 72%, #b07e52 73%);
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  filter: drop-shadow(0 0 12px #8ce06a55);
}
.large-cube { width: 30px; height: 34px; }
.minecraft-name {
  position: relative;
  z-index: 1;
  margin: 35px 0 15px;
  font-family: var(--font-display);
  font-size: clamp(24px, 2.6vw, 34px);
  font-weight: 400;
  line-height: 1.1;
  overflow-wrap: anywhere;
}
.minecraft-uuid {
  position: relative;
  z-index: 1;
  margin-bottom: 18px;
  font-family: var(--font-pixel);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--text-soft);
  overflow-wrap: anywhere;
}
.binding-note, .security-note { font-size: 12px; color: var(--text-soft); margin-bottom: 24px; }
.unbind-button { display: block; margin-top: 20px; }
.unbind-confirm { margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--line); font-size: 12px; }
.unbind-confirm p { margin-bottom: 15px; }
.service-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 30px 0 15px;
  font-family: var(--font-display);
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: 0.01em;
}
.service-dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--danger);
  box-shadow: 0 0 0 4px #ff7a661f;
}
.service-dot.online {
  background: var(--brand);
  box-shadow: 0 0 0 4px #8ce06a1f, 0 0 18px #8ce06a66;
}
.service-links { display: flex; flex-direction: column; margin-top: 30px; font-size: 13px; }
.service-links a { padding: 14px 0; border-bottom: 1px solid var(--line); transition: color 200ms; }
.service-links a:hover { color: var(--brand); }

@media (max-width: 900px) {
  .player-welcome__copy { max-width: 100%; }
  .player-welcome__word { font-size: clamp(96px, 22vw, 150px); opacity: 0.8; }
}

@media (max-width: 700px) {
  .player-welcome { min-height: 280px; padding: 24px; }
  .player-welcome h1 { font-size: clamp(30px, 9vw, 44px); }
  .player-welcome__scene { opacity: 0.42; }
  .player-grid { grid-template-columns: 1fr; gap: 22px; }
  .minecraft-panel { min-height: 0; }
}
</style>

