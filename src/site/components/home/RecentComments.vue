<script setup>
import CreatePanel from './CreatePanel.vue'
import PixelText from '../PixelText.vue'
import { COMMENTS_UNAVAILABLE } from '../../services/comments'
</script>

<template>
  <CreatePanel class="recent">
    <div class="inner">
      <header>
        <h2>
          <PixelText
            text="最近评论"
            :px="3"
          />
        </h2>
      </header>
      <p
        class="state"
        role="status"
      >
        {{ COMMENTS_UNAVAILABLE }}
      </p>
    </div>
  </CreatePanel>
</template>

<style scoped>
.inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 22px clamp(16px, 2.4vw, 28px);
}
.state {
  flex: 1;
  display: grid;
  place-items: center;
  min-height: 80px;
  padding-block: 20px;
  text-align: center;
  font-family: var(--font-body);
  color: rgba(255, 255, 255, 0.7);
}
</style>
