<script setup>
import { onUnmounted, ref } from 'vue'
import AnimatedTitle from '@/components/cinematic/AnimatedTitle.vue'
import { media } from '@/assets/media'
import Icon from '@/components/ui/Icon.vue'
import { prefersReducedMotion, useMotionContext } from '@/animations/motion'

const root = ref(null)
const stage = ref(null)
const frame = ref(null)
const image = ref(null)
const bar = ref(null)
const progress = ref(null)
const hint = ref(null)

const reducedMotion = prefersReducedMotion()
let breakpoints = null

useMotionContext(root, ({ gsap, reduced }) => {
  if (reduced || !stage.value || !frame.value) return

  breakpoints = gsap.matchMedia()

  // 桌面：钉住整屏，用 scrub 把居中小窗展开成满屏画面。
  breakpoints.add('(min-width: 900px)', () => {
    const stageEl = stage.value
    const frameEl = frame.value
    if (!stageEl || !frameEl) return

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stageEl,
        start: 'top top',
        end: '+=150%',
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    timeline.fromTo(
      frameEl,
      { width: 384, height: 240, borderRadius: 22 },
      {
        width: () => stageEl.clientWidth,
        height: () => stageEl.clientHeight,
        borderRadius: 0,
        duration: 1,
      },
      0,
    )

    if (image.value) {
      // 画面反向微缩放，让展开像一次推镜，而不是拉伸图片。
      timeline.fromTo(image.value, { scale: 1.34 }, { scale: 1, duration: 1 }, 0)
    }

    if (progress.value) {
      timeline.fromTo(progress.value, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
    }

    if (hint.value) {
      timeline.to(hint.value, { opacity: 0, duration: 0.14 }, 0)
    }

    if (bar.value) {
      timeline.to(bar.value, { opacity: 0, duration: 0.12 }, 0.88)
    }
  })

  // 小屏：不钉住，只保留一次普通的进入淡入。
  breakpoints.add('(max-width: 899px)', () => {
    if (!frame.value) return
    gsap.from(frame.value, {
      y: 28,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stage.value,
        start: 'top 86%',
        once: true,
      },
    })
  })
})

onUnmounted(() => {
  breakpoints?.revert()
})
</script>

<template>
  <section
    id="about"
    ref="root"
    class="about"
    :class="{ 'is-reduced': reducedMotion }"
  >
    <header class="about__head">
      <span
        class="about__rule"
        aria-hidden="true"
      />
      <AnimatedTitle
        as="h2"
        class="about__title display"
        title="会呼吸的世界"
        align="center"
      />
      <p class="about__line film-line">
        一方天地，慢慢生长。
      </p>
    </header>

    <div
      ref="stage"
      class="about__stage"
    >
      <div
        ref="frame"
        class="about__frame"
      >
        <img
          ref="image"
          class="about__image"
          :src="media.about"
          alt="方块世界里的原野、远山与建筑"
          decoding="async"
        >
        <span
          class="about__veil"
          aria-hidden="true"
        />
      </div>

      <div
        ref="bar"
        class="about__bar"
        aria-hidden="true"
      >
        <span class="about__progress">
          <span
            ref="progress"
            class="about__progress-fill"
          />
        </span>
        <span
          ref="hint"
          class="about__hint"
        >
          继续向下
          <Icon
            name="arrow-down"
            :size="13"
          />
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  padding-top: clamp(88px, 12vw, 176px);
  padding-bottom: clamp(90px, 12vw, 170px);
  background: #050505;
}

.about__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  width: min(1400px, calc(100% - 2 * var(--page-pad)));
  margin-inline: auto;
  text-align: center;
}

.about__rule {
  display: block;
  width: 46px;
  height: 1px;
  background: var(--brand);
  opacity: 0.9;
}

.about__title {
  color: var(--text-main);
  font-size: clamp(42px, 6.4vw, 112px);
  letter-spacing: 0.04em;
}

.about__line {
  margin: 0;
  letter-spacing: 0.26em;
}

.about__stage {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 520px;
  margin-top: clamp(30px, 4vw, 58px);
}

.about__frame {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid #f2efe21a;
  border-radius: 0;
  background: #0a0a0a;
  box-shadow: 0 60px 160px #000000b3;
  transform: translate(-50%, -50%);
}

.about__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

.about__veil {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 46%, #05050500 54%, #050505a8 100%),
    linear-gradient(180deg, #05050500 62%, #0505057a 100%);
}

.about__bar {
  position: absolute;
  right: var(--page-pad);
  bottom: clamp(20px, 3.4vh, 40px);
  left: var(--page-pad);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: clamp(18px, 3vw, 40px);
}

.about__progress {
  position: relative;
  flex: 1;
  height: 1px;
  overflow: hidden;
  background: #f2efe233;
}

.about__progress-fill {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: left center;
}

.about__hint {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #f2efe2a6;
  font-size: 11px;
  letter-spacing: 0.3em;
  white-space: nowrap;
}

/* 移动端与 reduced-motion：静态大图，不做钉住展开。 */
@media (max-width: 899px) {
  .about__stage {
    height: auto;
    min-height: 0;
    width: min(1080px, calc(100% - 2 * var(--page-pad)));
    margin: clamp(36px, 7vw, 64px) auto 0;
  }

  .about__frame {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;
    border-radius: 16px;
    transform: none;
  }

  .about__bar { display: none; }
}

.about.is-reduced .about__stage {
  height: auto;
  min-height: 0;
  width: min(1080px, calc(100% - 2 * var(--page-pad)));
  margin: clamp(36px, 7vw, 64px) auto 0;
}

.about.is-reduced .about__frame {
  position: relative;
  top: auto;
  left: auto;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  transform: none;
}

.about.is-reduced .about__bar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .about__bar { display: none; }
}
</style>
