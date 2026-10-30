<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { errorMessage } from '@/utils/errors'

const auth = useAuthStore()
const busy = ref(false)
const error = ref('')
const message = ref('')
const confirmUnbind = ref(false)

async function bind() {
  busy.value = true
  error.value = ''
  message.value = ''
  try {
    await auth.microsoftConnect()
  } catch (e) {
    error.value = errorMessage(e, '无法发起微软绑定')
    busy.value = false
  }
}

async function unbind() {
  busy.value = true
  error.value = ''
  message.value = ''
  try {
    await authApi.microsoftUnbind()
    await auth.fetchMe()
    message.value = '我的世界账号已解绑'
    confirmUnbind.value = false
  } catch (e) {
    error.value = errorMessage(e, '解绑失败')
  } finally {
    busy.value = false
  }
}
</script>

<template>
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
      v-if="error"
      class="alert alert-error"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-if="message"
      class="alert alert-success"
      role="status"
    >
      {{ message }}
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
            :disabled="busy"
            @click="unbind"
          >
            确认解绑
          </button>
          <button
            class="btn-secondary"
            :disabled="busy"
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
        :disabled="busy"
        @click="bind"
      >
        {{ busy ? '跳转中…' : '绑定微软账号 ↗' }}
      </button>
    </template>
  </section>
</template>

<style scoped>
.panel-heading h2 {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 400;
  line-height: 1.15;
}

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

.binding-note { margin-bottom: 24px; font-size: 12px; color: var(--text-soft); }
.unbind-button { display: block; margin-top: 20px; }
.unbind-confirm { margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--line); font-size: 12px; }
.unbind-confirm p { margin-bottom: 15px; }

@media (max-width: 700px) {
  .minecraft-panel { min-height: 0; }
}
</style>
