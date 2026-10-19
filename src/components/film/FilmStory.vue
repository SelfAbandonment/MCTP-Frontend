<script setup>
import { ref } from 'vue'
import AnimatedTitle from '@/components/cinematic/AnimatedTitle.vue'
import CinematicButton from '@/components/cinematic/CinematicButton.vue'
import FilmTilt from './FilmTilt.vue'
import { media } from '@/assets/media'
import { useMotionContext } from '@/animations/motion'

const root = ref(null)
const stage = ref(null)
const foot = ref(null)
const shot = ref(null)

useMotionContext(root, ({ gsap, reduced }) => {
  if (reduced) return
  const compact = window.matchMedia('(max-width: 899px)').matches

  // 图片视差：桌面端轻微缩放 + 上下位移，reduced-motion 与窄屏下保持静态
  if (!compact && shot.value) {
    gsap.fromTo(
      shot.value,
      { yPercent: -3.5, scale: 1.07 },
      {
        yPercent: 3.5,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stage.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  }

  // 进入视口时淡入上移
  const reveals = [stage.value, foot.value].filter(Boolean)
  if (!reveals.length) return
  gsap.from(reveals, {
    y: 32,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.16,
    scrollTrigger: {
      trigger: stage.value,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  })
})
</script>

<template>
  <section
    id="story"
    ref="root"
    class="film-section story"
    aria-labelledby="story-title"
  >
    <div class="film-container story__head">
      <AnimatedTitle
        id="story-title"
        class="story__title"
        title="世界故事"
        as="h2"
        align="center"
        :stagger="0.08"
      />
    </div>

    <div
      ref="stage"
      class="story__stage"
    >
      <FilmTilt
        :max="8"
        :scale="1"
      >
        <div class="story-img-container">
          <div class="story-img-mask">
            <div class="story-img-content">
              <img
                ref="shot"
                class="story__shot"
                :src="media.entrance"
                alt="冰晶洞窟尽头，一扇透出微光的石门"
                loading="lazy"
                decoding="async"
              >
            </div>
            <span
              class="story__veil"
              aria-hidden="true"
            />
          </div>

          <svg
            class="story__corner"
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 114H94A20 20 0 0 0 114 94V10"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <circle
              cx="114"
              cy="10"
              r="2.5"
              fill="currentColor"
            />
          </svg>
        </div>
      </FilmTilt>
    </div>

    <div
      ref="foot"
      class="film-container story__foot"
    >
      <div class="story__note">
        <p class="film-line story__line">
          一切，从一块方块开始。
        </p>
        <CinematicButton
          title="阅读"
          to="/announcements"
          variant="bone"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.story {
  position: relative;
  padding-bottom: clamp(72px, 8vw, 120px);
  background: #050505;
}

.story__head {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  mix-blend-mode: difference;
  pointer-events: none;
}

.story__title {
  position: relative;
  font-size: clamp(58px, 10.5vw, 168px);
  color: #f5f2e6;
  text-align: center;
}

.story__stage {
  position: relative;
  z-index: 1;
  margin-top: clamp(-72px, -5vw, -28px);
  margin-inline: calc(var(--page-pad) * -1);
}

/* 图片背后一层极淡的草绿空气光，让黑底不至于死平 */
.story__stage::before {
  content: '';
  position: absolute;
  inset: 8% 10% 6%;
  pointer-events: none;
  background: radial-gradient(58% 58% at 50% 46%, #8ce06a1a 0%, transparent 72%);
  filter: blur(28px);
}

.story__shot {
  position: absolute;
  top: -6%;
  left: 0;
  width: 100%;
  height: 112%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.04) brightness(0.92);
  will-change: transform;
}

/* 电影感压角：上下与左右各压一点，画面边缘融进黑底 */
.story__veil {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(180deg, #05050580 0%, #05050500 22%, #05050500 64%, #050505b3 100%),
    linear-gradient(90deg, #0505054d 0%, #05050500 28%, #05050500 74%, #05050540 100%);
}

/* 右下角自绘圆角角标，落在多边形裁切后的留白里，像取景框的一角 */
.story__corner {
  position: absolute;
  right: 6%;
  bottom: 22%;
  width: clamp(72px, 7.4vw, 112px);
  height: auto;
  color: #8ce06ab3;
  filter: drop-shadow(0 6px 24px #00000099);
  pointer-events: none;
}

.story__foot {
  display: flex;
  justify-content: flex-end;
  margin-top: clamp(18px, 3vw, 44px);
}

.story__note {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(14px, 1.8vw, 22px);
  max-width: 26rem;
}

.story__line {
  margin: 0;
}

@media (max-width: 899px) {
  .story__stage {
    margin-top: 40px;
  }

  .story__foot {
    justify-content: center;
    margin-top: 32px;
  }

  .story__note {
    align-items: center;
    max-width: none;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .story__title {
    font-size: clamp(52px, 16vw, 92px);
  }

  .story__corner {
    width: 62px;
  }
}
</style>
