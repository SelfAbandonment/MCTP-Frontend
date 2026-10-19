<script setup>
import AnnouncementFeed from '@/components/AnnouncementFeed.vue'
</script>

<template>
  <section class="announcements-page">
    <span
      class="announcements-page__word"
      aria-hidden="true"
    >公告</span>
    <div class="page-heading">
      <div>
        <p class="eyebrow">
          社区动态
        </p>
        <h1>世界里的新鲜事。</h1>
      </div>
      <RouterLink
        to="/"
        class="btn-secondary"
      >
        回到原野 ↗
      </RouterLink>
    </div>
    <AnnouncementFeed />
  </section>
</template>

<style scoped>
.announcements-page {
  position: relative;
  isolation: isolate;
  max-width: 940px;
  margin: 0 auto;
}

.announcements-page__word {
  position: absolute;
  top: -0.22em;
  left: 0;
  z-index: -1;
  font-family: var(--font-display);
  font-size: clamp(96px, 14vw, 200px);
  line-height: 0.8;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 1px #f2efe217;
  pointer-events: none;
  user-select: none;
}

.announcements-page .page-heading {
  margin-bottom: 0;
  padding-bottom: 26px;
  border-bottom: 1px solid var(--line);
}

.announcements-page h1 {
  font-family: var(--font-display);
  font-size: clamp(40px, 5.4vw, 76px);
  font-weight: 400;
  line-height: 1.02;
}

@media (max-width: 700px) {
  .announcements-page__word {
    top: 0;
    font-size: clamp(84px, 26vw, 140px);
    opacity: 0.75;
  }

  .announcements-page .page-heading {
    padding-bottom: 20px;
  }

  .announcements-page h1 {
    font-size: clamp(34px, 9.4vw, 52px);
  }
}
</style>
