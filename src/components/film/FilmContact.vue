<script setup>
import { ref } from 'vue'
import AnimatedTitle from '@/components/cinematic/AnimatedTitle.vue'
import CinematicButton from '@/components/cinematic/CinematicButton.vue'
import { media } from '@/assets/media'
import { useMotionContext } from '@/animations/motion'

const joinGuide = 'https://docs.qq.com/space/DTXNidGZ1S2FncG9v'

const root = ref(null)
const panel = ref(null)
const sideLeft = ref(null)
const sideRight = ref(null)
const core = ref(null)

useMotionContext(root, ({ gsap, reduced }) => {
  if (reduced) return
  const compact = window.matchMedia('(max-width: 899px)').matches

  // 两侧夹缝图片跟随滚动轻微错位；窄屏图片退化为背景，不做位移
  if (!compact && panel.value && sideLeft.value && sideRight.value) {
    const scrubTrigger = () => ({
      trigger: panel.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    })
    gsap.fromTo(sideLeft.value, { y: -44 }, { y: 44, ease: 'none', scrollTrigger: scrubTrigger() })
    gsap.fromTo(sideRight.value, { y: 56 }, { y: -36, ease: 'none', scrollTrigger: scrubTrigger() })
  }

  // 中间文案与按钮进入视口时淡入上移
  if (core.value && panel.value) {
    gsap.from(core.value, {
      y: 32,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: panel.value,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })
  }
})
</script>

<template>
  <section
    id="contact"
    ref="root"
    class="film-section contact"
    aria-labelledby="contact-title"
  >
    <div class="film-container">
      <div
        ref="panel"
        class="contact__panel"
      >
        <div
          ref="sideLeft"
          class="contact__side contact__side--left"
          aria-hidden="true"
        >
          <figure class="contact__clip contact__clip--one contact-clip-path-1">
            <img
              :src="media.contact.one"
              alt=""
              loading="lazy"
              decoding="async"
            >
          </figure>
          <figure class="contact__clip contact__clip--two contact-clip-path-2">
            <img
              :src="media.contact.two"
              alt=""
              loading="lazy"
              decoding="async"
            >
          </figure>
        </div>

        <div
          ref="sideRight"
          class="contact__side contact__side--right"
          aria-hidden="true"
        >
          <figure class="contact__single sword-man-clip-path">
            <img
              :src="media.contact.three"
              alt=""
              loading="lazy"
              decoding="async"
            >
          </figure>
        </div>

        <div
          ref="core"
          class="contact__core"
        >
          <AnimatedTitle
            id="contact-title"
            class="contact__title"
            title="一起建造"
            as="h2"
            align="center"
            :stagger="0.08"
          />
          <p class="film-line contact__line">
            世界还缺一个你。
          </p>
          <div class="contact__actions">
            <CinematicButton
              title="入服指引"
              :href="joinGuide"
              variant="ghost"
              external
            />
            <CinematicButton
              title="玩家中心"
              to="/login"
              variant="lime"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding-top: clamp(88px, 9vw, 144px);
  padding-bottom: clamp(110px, 13vw, 190px);
  background: #050505;
}

.contact__panel {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(520px, 66vh, 680px);
  padding: clamp(64px, 8vw, 112px) clamp(24px, 5vw, 80px);
  overflow: hidden;
  border: 1px solid #f2efe21f;
  border-radius: clamp(24px, 3vw, 40px);
  background:
    radial-gradient(90% 120% at 50% 118%, #1b3214 0%, #0c150a 42%, #060806 74%),
    #060806;
  box-shadow:
    inset 0 1px 0 #ffffff12,
    0 50px 120px #00000099;
}

.contact__side {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

/* 左侧夹缝：火与光 */
.contact__side--left {
  top: 0;
  bottom: 0;
  left: clamp(-130px, -7vw, -36px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(10px, 1.6vw, 22px);
  width: clamp(220px, 25vw, 360px);
}

.contact__clip {
  margin: 0;
  overflow: hidden;
}

.contact__clip--one {
  width: 88%;
  margin-left: 6%;
  aspect-ratio: 1000 / 683;
  transform: rotate(-5deg);
}

.contact__clip--two {
  width: 98%;
  margin-left: 12%;
  aspect-ratio: 1282 / 814;
  transform: rotate(3deg) translateY(-6%);
}

.contact__clip img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.8) contrast(1.06) brightness(0.66);
}

/* 右侧夹缝：单人建筑/夜景裁切 */
.contact__side--right {
  top: clamp(-80px, -5vw, -24px);
  right: clamp(-88px, -3.4vw, 0px);
  bottom: clamp(-40px, -2.6vw, -10px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(220px, 24vw, 340px);
}

.contact__single {
  margin: 0;
  width: 100%;
  aspect-ratio: 16 / 11;
  overflow: hidden;
  transform: rotate(3deg) scale(1.08);
}

.contact__single img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.05) brightness(0.72);
}

.contact__core {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(18px, 2.4vw, 30px);
  width: min(100%, 46rem);
  text-align: center;
}

.contact__title {
  font-size: clamp(52px, 8.6vw, 132px);
  color: #f6f3e7;
  text-shadow: 0 22px 70px #000000b3;
}

.contact__line {
  margin: 0;
  color: #f2efe2a6;
}

.contact__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: clamp(6px, 1vw, 14px);
}

@media (max-width: 899px) {
  .contact__side--left {
    display: none;
  }

  .contact__side--right {
    top: auto;
    right: -45%;
    bottom: -20%;
    z-index: 0;
    width: min(70vw, 320px);
    opacity: 0.1;
    filter: blur(1.5px) brightness(0.7);
  }

  .contact__single {
    transform: rotate(3deg);
  }

  .contact__panel {
    min-height: 0;
  }
}

@media (max-width: 640px) {
  .contact__panel {
    padding: clamp(56px, 15vw, 84px) 22px;
    border-radius: 24px;
  }

  .contact__title {
    font-size: clamp(48px, 15vw, 84px);
  }
}
</style>
