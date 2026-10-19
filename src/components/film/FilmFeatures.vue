<script setup>
import { ref } from 'vue'
import AnimatedTitle from '@/components/cinematic/AnimatedTitle.vue'
import FilmBentoCard from './FilmBentoCard.vue'
import FilmTilt from './FilmTilt.vue'
import { media } from '@/assets/media'
import { prefersReducedMotion, useMotionContext } from '@/animations/motion'

const root = ref(null)

// 只在桌面精细指针且未开启减动效时启用 3D 倾斜，触屏与窄屏保持静态。
const tiltEnabled =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(min-width: 900px)').matches &&
  window.matchMedia('(pointer: fine)').matches &&
  !prefersReducedMotion()

const lead = {
  item: media.features[0],
  to: '/login',
}

const cards = [
  { item: media.features[1], to: '/login', area: 'a' },
  { item: media.features[2], to: '/announcements', area: 'b' },
  { item: media.features[3], to: '/announcements', area: 'c' },
  { item: media.features[4], to: '/announcements', area: 'd' },
]

useMotionContext(root, ({ gsap, ScrollTrigger, reduced }) => {
  if (reduced || !root.value) return

  // 逐卡淡入上移：同一屏进入的卡片带 stagger，滚动时形成节奏。
  const items = root.value.querySelectorAll('.features__reveal')
  gsap.set(items, { y: 32, opacity: 0 })
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.1,
      overwrite: true,
    }),
  })
})
</script>

<template>
  <section
    id="features"
    ref="root"
    class="features film-section"
  >
    <div class="film-container">
      <header class="features__head features__reveal">
        <AnimatedTitle
          as="h2"
          class="features__title display"
          title="玩法"
        />
        <p class="features__line film-line">
          五种方式，走进同一个世界。
        </p>
      </header>

      <div class="features__lead features__reveal">
        <component
          :is="tiltEnabled ? FilmTilt : 'div'"
          v-bind="tiltEnabled ? { max: 4, scale: 0.99 } : {}"
          class="features__tilt"
        >
          <FilmBentoCard
            :item="lead.item"
            :to="lead.to"
            big
          />
        </component>
      </div>

      <div class="features__grid">
        <div
          v-for="card in cards"
          :key="card.item.title"
          class="features__cell features__reveal"
          :class="`features__cell--${card.area}`"
        >
          <component
            :is="tiltEnabled ? FilmTilt : 'div'"
            v-bind="tiltEnabled ? { max: 5, scale: 0.985 } : {}"
            class="features__tilt"
          >
            <FilmBentoCard
              :item="card.item"
              :to="card.to"
            />
          </component>
        </div>

        <div class="features__cell features__cell--more features__reveal">
          <article class="features__more">
            <span class="features__more-note">
              即将开放
            </span>
            <div class="features__more-foot">
              <h3 class="features__more-title display">
                更多
              </h3>
              <svg
                class="features__more-arrow"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3 18h3v3H3zM6 15h3v3H6zM9 12h3v3H9zM12 9h3v3h-3zM15 6h3v3h-3zM15 3h6v3h-6zM18 6h3v6h-3z" />
              </svg>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  position: relative;
  padding-top: clamp(96px, 12vw, 168px);
  background: #050505;
}

.features__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(14px, 2vw, 32px);
  margin-bottom: clamp(30px, 4.4vw, 64px);
}

.features__title {
  color: var(--text-main);
  font-size: clamp(58px, 8vw, 140px);
  letter-spacing: 0.02em;
}

.features__line {
  max-width: 24ch;
  margin: 0 0 10px;
  text-align: right;
}

.features__lead {
  height: clamp(420px, 62vh, 720px);
  margin-bottom: clamp(14px, 1.4vw, 22px);
}

.features__tilt {
  display: block;
  height: 100%;
}

.features__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  gap: clamp(14px, 1.4vw, 22px);
}

.features__cell {
  min-width: 0;
}

.features__cell--a {
  grid-row: span 2;
  min-height: clamp(440px, 64vh, 780px);
}

.features__cell--b,
.features__cell--c {
  min-height: clamp(210px, 30vh, 360px);
}

.features__cell--d,
.features__cell--more {
  min-height: clamp(250px, 36vh, 460px);
}

/* 品牌绿纯色卡：不播放视频，只做“更多即将开放”的收尾。 */
.features__more {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  height: 100%;
  padding: clamp(20px, 2.2vw, 34px);
  overflow: hidden;
  border-radius: 14px;
  background: var(--brand);
  color: #071006;
  isolation: isolate;
}

.features__more::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  opacity: 0.16;
  background-image:
    repeating-linear-gradient(90deg, #071006 0 1px, transparent 1px 32px),
    repeating-linear-gradient(0deg, #071006 0 1px, transparent 1px 32px);
}

.features__more-note {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3em;
}

.features__more-foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.features__more-title {
  margin: 0;
  color: #071006;
  font-size: clamp(64px, 7.4vw, 132px);
  line-height: 0.82;
  letter-spacing: 0.02em;
}

.features__more-arrow {
  flex-shrink: 0;
  width: clamp(32px, 3.2vw, 52px);
  height: auto;
  margin-bottom: 0.08em;
  fill: currentColor;
}

@media (max-width: 899px) {
  .features__line {
    margin-bottom: 0;
    text-align: left;
  }

  .features__lead {
    height: clamp(340px, 56vh, 520px);
  }

  .features__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .features__cell--a {
    grid-row: auto;
    min-height: clamp(320px, 50vh, 540px);
  }

  .features__cell--b,
  .features__cell--c,
  .features__cell--d,
  .features__cell--more {
    min-height: clamp(240px, 42vh, 400px);
  }
}

@media (pointer: coarse) {
  .features__more-arrow {
    width: 34px;
  }
}
</style>
