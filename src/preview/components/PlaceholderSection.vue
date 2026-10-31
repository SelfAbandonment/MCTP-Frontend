<script setup>
/**
 * 文件用途：预览页通用占位区块组件
 * 作用：玩法介绍、下载区、功能区等「下一阶段填充」的区块统一使用本组件占位，
 *       保证骨架阶段页面结构完整且视觉统一。
 */
defineProps({
  // 作用：区块标题（如「玩法介绍」「下载区」）。
  title: { type: String, required: true },
  // 作用：占位说明文字，向查看者说明该区块后续规划。
  note: { type: String, default: '下一阶段填充' },
})
</script>

<template>
  <!-- 作用：占位区块容器。 -->
  <section class="preview-card preview-placeholder">
    <h2 class="preview-section-title">
      {{ title }}
    </h2>
    <!-- TODO-ASSET: 本区块内容待填充（含素材/数据/组件），当前仅占位展示。 -->
    <div class="preview-placeholder__box">
      <span
        class="preview-placeholder__icon"
        aria-hidden="true"
      >[ 区块 ]</span>
      <p class="preview-placeholder__note">
        {{ note }}
      </p>
      <p class="preview-muted">
        本区块为骨架占位，下一阶段实现具体功能与素材。
      </p>
    </div>
  </section>
</template>

<style scoped>
/* 作用：占位内容框——居中虚线边框，突出“待填充”语义。 */
.preview-placeholder__box {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px dashed var(--preview-line-strong);
  border-radius: 10px;
  background: var(--preview-bg-panel-soft);
}

/* 作用：占位图标——铜黄强调色。 */
.preview-placeholder__icon {
  font-size: 40px;
  color: var(--preview-accent);
}

/* 作用：占位说明文字。 */
.preview-placeholder__note {
  margin: 0;
  font-size: 16px;
  color: var(--preview-text);
}
</style>
