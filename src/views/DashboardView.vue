<script setup>
import { useAuthStore } from '@/stores/auth'
import CreatePanel from '@/site/components/home/CreatePanel.vue'
import PixelAvatar from '@/site/components/home/PixelAvatar.vue'
import PixelText from '@/site/components/PixelText.vue'
import AccountPanel from '@/components/dashboard/AccountPanel.vue'
import MinecraftPanel from '@/components/dashboard/MinecraftPanel.vue'
import SecurityPanel from '@/components/dashboard/SecurityPanel.vue'
import ServicePanel from '@/components/dashboard/ServicePanel.vue'
import CommunityPulsePanel from '@/components/dashboard/CommunityPulsePanel.vue'
import PointsPanel from '@/components/dashboard/PointsPanel.vue'

const auth = useAuthStore()
</script>

<template>
  <CreatePanel class="player-welcome">
    <div class="player-welcome__content">
      <PixelAvatar
        :uid="auth.user?.id"
        :src="auth.user?.avatar || ''"
        :size="96"
      />
      <div class="player-welcome__copy">
        <PixelText
          text="玩家中心"
          :px="3"
        />
        <h1>你好，{{ auth.user?.minecraft?.username || auth.user?.username }}。</h1>
        <p>管理你的账号、正版绑定与社区积分。</p>
        <RouterLink
          to="/announcements"
          class="btn-secondary"
        >查看社区公告</RouterLink>
      </div>
    </div>
  </CreatePanel>
  <div class="player-grid">
    <CommunityPulsePanel />
    <PointsPanel />
    <AccountPanel />
    <MinecraftPanel />
    <SecurityPanel />
    <ServicePanel />
  </div>
</template>

<style scoped>
.player-welcome { margin-bottom: 32px; }
.player-welcome__content {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: clamp(24px, 4vw, 40px);
}
.player-welcome__copy { min-width: 0; }
.player-welcome__copy h1 {
  margin: 18px 0 12px;
  font-size: clamp(24px, 3vw, 36px);
  overflow-wrap: anywhere;
}
.player-welcome__copy p {
  color: var(--text-soft);
  margin-bottom: 20px;
}
.player-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  align-items: start;
}
@media (max-width: 700px) {
  .player-welcome__content { flex-direction: column; align-items: flex-start; gap: 16px; }
  .player-grid { grid-template-columns: 1fr; }
}
</style>
