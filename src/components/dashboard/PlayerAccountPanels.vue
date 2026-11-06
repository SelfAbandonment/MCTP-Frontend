<script setup>
import AccountPanel from '@/components/dashboard/AccountPanel.vue'
import MinecraftPanel from '@/components/dashboard/MinecraftPanel.vue'
import SecurityPanel from '@/components/dashboard/SecurityPanel.vue'
import ServicePanel from '@/components/dashboard/ServicePanel.vue'
import CommunityPulsePanel from '@/components/dashboard/CommunityPulsePanel.vue'
import PointsPanel from '@/components/dashboard/PointsPanel.vue'

</script>

<template>
  <div class="player-grid">
    <PointsPanel />
    <AccountPanel />
    <MinecraftPanel />
    <SecurityPanel />
    <ServicePanel />
    <CommunityPulsePanel />
  </div>
</template>

<style scoped>
.player-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  align-items: start;
}
@media (max-width: 700px) {
  .player-grid { grid-template-columns: 1fr; }
}
</style>
