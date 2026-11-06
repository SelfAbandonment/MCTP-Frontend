<script setup>
import CreatePanel from '@/site/components/home/CreatePanel.vue'
import PixelText from '@/site/components/PixelText.vue'
</script>

<template>
  <div class="auth-layout">
    <CreatePanel class="auth-frame">
      <div class="auth-content">
        <div class="auth-brand">
          <PixelText
            text="MCREATOPIA"
            :px="3"
          />
          <p>机械动力 · 我的世界玩家社区</p>
        </div>
        <slot />
      </div>
    </CreatePanel>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  padding-block: clamp(16px, 4vh, 48px);
}
.auth-frame {
  width: min(520px, 100%);
}
.auth-content {
  padding: clamp(24px, 4vw, 44px);
}
.auth-brand {
  padding-bottom: 24px;
  margin-bottom: 28px;
  color: var(--brass-hi);
  border-bottom: 2px solid var(--line);
}
.auth-brand p {
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-soft);
}
:slotted(h1) {
  font-size: 28px;
  margin-bottom: 12px;
}
:slotted(.auth-description) {
  margin-bottom: 24px;
}
</style>
