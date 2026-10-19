<script setup>
import { onMounted } from 'vue'
import { ScrollTrigger } from '@/animations/motion'
import FilmHero from '@/components/film/FilmHero.vue'
import FilmAbout from '@/components/film/FilmAbout.vue'
import FilmFeatures from '@/components/film/FilmFeatures.vue'
import FilmStory from '@/components/film/FilmStory.vue'
import FilmContact from '@/components/film/FilmContact.vue'

onMounted(() => {
  requestAnimationFrame(() => ScrollTrigger.refresh())
})
</script>

<template>
  <div class="film home">
    <div
      class="film-grain"
      aria-hidden="true"
    />
    <FilmHero />
    <FilmAbout />
    <FilmFeatures />
    <FilmStory />
    <FilmContact />
  </div>
</template>

<style scoped>
.home {
  position: relative;
  width: 100%;
  background: #050505;
}
</style>
