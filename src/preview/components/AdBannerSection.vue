<script setup>
/**
 * 文件用途：预览页广告区组件（主界面第一屏右侧）
 * 作用：渲染广告位；骨架阶段使用两套占位构图（横版 1200x300 / 竖版 600x900）供服主挑选风格。
 */
// 原因：v-reveal / v-tilt 指令改为组件内局部注册（<script setup> 中 v 前缀变量自动注册为指令），
//       不再改动全局 src/main.js，保持现有框架零侵入。
import { reveal as vReveal } from '@/preview/directives/reveal'
// 原因：占位横幅用 Vite 资源导入，构建期自动处理路径，比硬编码字符串更可靠。
import adWide from '@/preview/assets/placeholders/ad-banner-wide.svg'
import adTall from '@/preview/assets/placeholders/ad-banner-tall.svg'

// 作用：两套构图参考（横版为主展示，竖版为风格参考）。
const variants = [
  { key: 'wide', label: '横版 1200×300', src: adWide },
  { key: 'tall', label: '竖版 600×900', src: adTall },
]
</script>

<template>
  <!-- 作用：广告区容器；v-reveal 使其滚入视口时淡入上浮（比公告区略延迟，形成错峰）。 -->
  <section
    v-reveal="0.1"
    class="preview-card preview-ad"
    aria-labelledby="ad-title"
  >
    <h2
      id="ad-title"
      class="preview-section-title"
    >
      广告
    </h2>
    <!-- 作用：横版主展示位（桌面端右侧广告位优先使用横版）。 -->
    <!-- TODO-ASSET: 广告素材待补；当前为横版 1200x300 占位。 -->
    <img
      class="preview-ad__banner"
      :src="adWide"
      alt="广告位横版占位图 1200x300"
      width="1200"
      height="300"
      loading="lazy"
    >
    <!-- 作用：两套构图参考缩略图，供服主挑选横版/竖版风格。 -->
    <div class="preview-ad__refs">
      <figure
        v-for="v in variants"
        :key="v.key"
        class="preview-ad__ref"
      >
        <img
          :src="v.src"
          :alt="`广告 ${v.label} 构图参考`"
          loading="lazy"
          @contextmenu.prevent
        >
        <figcaption>{{ v.label }}</figcaption>
      </figure>
    </div>
    <p class="preview-muted">
      TODO-ASSET：以上为横版/竖版两套构图参考，待服主定风格后替换真实素材。
    </p>
  </section>
</template>

<style scoped>
/* 作用：广告横幅铺满容器宽度、圆角、描边。 */
.preview-ad__banner {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--preview-line-strong);
}

/* 作用：两套构图参考横向排布。 */
.preview-ad__refs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 14px 0 10px;
}

/* 作用：参考图卡片。 */
.preview-ad__ref {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 作用：参考缩略图——统一高度裁切，避免竖版过高。 */
.preview-ad__ref img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--preview-line);
}

/* 作用：参考图说明文字。 */
.preview-ad__ref figcaption {
  font-size: 12px;
  color: var(--preview-text-soft);
  text-align: center;
}

@media (max-width: 560px) {
  .preview-ad__refs {
    grid-template-columns: 1fr;
  }
}
</style>
