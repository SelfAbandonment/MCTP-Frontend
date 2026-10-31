<script setup>
defineProps({ title: { type: String, required: true } })
</script>

<template>
  <div class="page-heading">
    <div>
      <p class="eyebrow">
        社区管理
      </p>
      <h1>{{ title }}</h1>
    </div>
    <RouterLink
      to="/"
      class="btn-secondary"
    >
      查看官网 ↗
    </RouterLink>
  </div>
  <nav
    class="management-tabs"
    aria-label="管理功能"
  >
    <RouterLink to="/manage/announcements">
      社区公告
    </RouterLink>
    <RouterLink to="/manage/players">
      玩家管理
    </RouterLink>
    <RouterLink to="/manage/points">
      积分发放
    </RouterLink>
  </nav>
</template>

<style scoped>
.page-heading {
  margin-bottom: 0;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.page-heading h1 {
  font-family: var(--font-display);
  font-size: clamp(34px, 4.6vw, 64px);
  font-weight: 400;
  line-height: 1.04;
}

.management-tabs {
  margin-top: 0;
  margin-bottom: 30px;
}

@media (max-width: 700px) {
  .page-heading h1 {
    font-size: clamp(30px, 9vw, 46px);
  }

  .management-tabs {
    margin-bottom: 24px;
  }
}
</style>
