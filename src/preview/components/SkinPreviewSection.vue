<script setup>
/**
 * 文件用途：功能 C——皮肤预览 + 玩家基本信息组件
 * 作用：通过公开皮肤渲染服务（Crafatar）展示玩家头像 / 全身皮肤，并支持「拖拽旋转」查看；
 *       断网或渲染服务不可用时回退到本地 SVG 像素头像，避免审核环境破图。
 */
// 原因：v-reveal / v-tilt 指令改为组件内局部注册（<script setup> 中 v 前缀变量自动注册为指令），
//       不再改动全局 src/main.js，保持现有框架零侵入。
import { reveal as vReveal } from '@/preview/directives/reveal'
import { reactive } from 'vue'
// 原因：本地兜底头像随代码打包，断网也能显示，避免 Crafatar 不可用时的破图。
import skinFallback from '@/preview/assets/placeholders/skin-fallback.svg'

// 作用：皮肤渲染服务 URL 模板常量。
// 原因：Crafatar 免费公开（https://crafatar.com），用 UUID 模板拼 URL 即可渲染；
//      后续替换为自建皮肤服务时只需改这里的模板。
const AVATAR_URL = (uuid) => `https://crafatar.com/avatars/${uuid}?size=128&default=MHF_Steve`
const BODY_URL = (uuid) => `https://crafatar.com/renders/body/${uuid}?size=256&default=MHF_Steve`

// 作用：模拟玩家数据（UUID 为格式正确的示例 UUID，ID / 入服时间 / 在线状态均为模拟）。
// TODO-BACKEND: 玩家真实数据（UUID / 入服时间 / 在线状态）待对接后端玩家信息接口。
const players = [
  {
    uuid: '853c80ef-3c37-49fd-aa49-938b674a6e71',
    name: 'SteelSmith',
    joinDate: '2026-03-12',
    online: true,
    role: '建筑师',
    motto: '齿轮转动之处，皆为我的工厂。',
  },
  {
    uuid: 'b5b4428e-7e1d-4e6a-9f3c-1c8e7b6a2d4f',
    name: 'Ironforge_Leon',
    joinDate: '2026-05-02',
    online: false,
    role: '红石工程师',
    motto: '应力即正义。',
  },
  {
    uuid: 'd2f46a19-9c0b-4c21-8a63-77e1f0c5b3a8',
    name: 'CopperKite',
    joinDate: '2026-06-18',
    online: true,
    role: '后勤管理员',
    motto: '材料永远不够用。',
  },
]

// 作用：每张卡片的运行时状态（以 uuid 为键）。
// 原因：v-for 渲染多张卡片，需要按玩家分别记录「旋转角度 / 拖拽起点 / 是否加载失败」。
const rotation = reactive({})   // uuid -> 当前 rotateY 角度
const dragging = reactive({})   // uuid -> { startX, startRot } 或 null
const errored = reactive({})    // uuid -> 远端图片是否加载失败

// 作用：按下开始拖拽，记录起点。
function onDown(p, e) {
  dragging[p.uuid] = { startX: e.clientX, startRot: rotation[p.uuid] || 0 }
  // 原因：指针捕获保证拖出图片区域后仍能持续接收 move/up 事件。
  e.currentTarget.setPointerCapture?.(e.pointerId)
}

// 作用：拖拽中按水平位移换算旋转角度（限制 ±45°，避免过度翻转）。
function onMove(p, e) {
  const d = dragging[p.uuid]
  if (!d) return
  const dx = e.clientX - d.startX
  rotation[p.uuid] = Math.max(-45, Math.min(45, d.startRot + dx * 0.5))
}

// 作用：松开后回正。
function onUp(p) {
  dragging[p.uuid] = null
  rotation[p.uuid] = 0
}
</script>

<template>
  <!-- 作用：皮肤预览区容器。 -->
  <section
    v-reveal
    class="preview-card"
  >
    <h2 class="preview-section-title">
      皮肤预览
    </h2>
    <!-- 作用：玩家卡片网格。 -->
    <div class="preview-skin__grid">
      <!-- 作用：遍历玩家数据渲染卡片；在线状态用铜黄实心点标识。 -->
      <article
        v-for="p in players"
        :key="p.uuid"
        class="preview-skin__card"
      >
        <div class="preview-skin__body">
          <!-- 作用：全身皮肤图（Crafatar），支持拖拽旋转；失败时回退本地像素头像。 -->
          <img
            v-if="!errored[p.uuid]"
            :src="BODY_URL(p.uuid)"
            :alt="`${p.name} 的皮肤`"
            width="256"
            height="256"
            loading="lazy"
            draggable="false"
            class="preview-skin__render"
            :class="{ 'is-dragging': dragging[p.uuid] }"
            :style="{ transform: `rotateY(${rotation[p.uuid] || 0}deg)` }"
            @error="errored[p.uuid] = true"
            @contextmenu.prevent
            @pointerdown="onDown(p, $event)"
            @pointermove="onMove(p, $event)"
            @pointerup="onUp(p)"
            @pointercancel="onUp(p)"
            @pointerleave="onUp(p)"
          >
          <img
            v-else
            :src="skinFallback"
            :alt="`${p.name} 的本地兜底头像`"
            width="96"
            height="128"
            class="preview-skin__render preview-skin__render--fallback"
          >
          <!-- 作用：拖拽旋转操作提示。 -->
          <span class="preview-skin__hint">拖拽旋转</span>
        </div>
        <div class="preview-skin__info">
          <div class="preview-skin__name">
            <span
              class="preview-skin__dot"
              :class="{ '--offline': !p.online }"
            />
            {{ p.name }}
          </div>
          <!-- 作用：基本信息字段列表（字段名 + 值）。 -->
          <dl class="preview-skin__fields">
            <div><dt>ID</dt><dd>{{ p.name }}</dd></div>
            <div><dt>入服时间</dt><dd>{{ p.joinDate }}</dd></div>
            <div><dt>在线状态</dt><dd>{{ p.online ? '在线' : '离线' }}</dd></div>
            <div><dt>职业</dt><dd>{{ p.role }}</dd></div>
          </dl>
          <p class="preview-skin__motto">
            {{ p.motto }}
          </p>
        </div>
        <!-- 作用：头像图（Crafatar avatars），同样做加载失败兜底。 -->
        <img
          v-if="!errored[p.uuid]"
          class="preview-skin__avatar"
          :src="AVATAR_URL(p.uuid)"
          :alt="`${p.name} 的头像`"
          width="128"
          height="128"
          loading="lazy"
          draggable="false"
          @error="errored[p.uuid] = true"
          @contextmenu.prevent
        >
        <img
          v-else
          class="preview-skin__avatar"
          :src="skinFallback"
          :alt="`${p.name} 的本地兜底头像`"
          width="96"
          height="128"
        >
      </article>
    </div>
    <!-- TODO-BACKEND: 玩家信息为模拟数据；TODO-ASSET: 皮肤渲染依赖 Crafatar 公开服务。 -->
    <p class="preview-muted preview-skin__note">
      TODO-BACKEND：玩家信息为模拟数据，待对接后端玩家接口；皮肤经 Crafatar 公开服务渲染，断网时回退本地像素头像。
    </p>
  </section>
</template>

<style scoped>
/* 作用：玩家卡片单列纵向堆叠（信息较多），窄屏自适应。 */
.preview-skin__grid {
  display: grid;
  gap: 16px;
}

/* 作用：单张玩家卡片——暗棕底 + 铜黄描边，横向排布（左侧全身图 + 右侧信息）。 */
.preview-skin__card {
  position: relative;
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 20px;
  padding: 16px;
  border: 1px solid var(--preview-line-strong);
  border-radius: 10px;
  background: var(--preview-bg-panel-soft);
}

@media (max-width: 560px) {
  .preview-skin__card {
    grid-template-columns: 1fr;
  }
}

/* 作用：全身图容器——固定尺寸 + 3D 透视，供拖拽旋转。 */
.preview-skin__body {
  position: relative;
  width: 130px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--preview-bg);
  overflow: hidden;
  perspective: 600px;
  touch-action: pan-y; /* 原因：允许纵向滚动页面，横向拖拽交给旋转 */
}

/* 作用：皮肤图——3D 旋转主体；非拖拽时加过渡让回正更顺滑。 */
.preview-skin__render {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: grab;
  user-select: none;
  transition: transform 0.35s ease;
  transform-style: preserve-3d;
}

/* 作用：拖拽中关闭过渡，保证跟手。 */
.preview-skin__render.is-dragging {
  cursor: grabbing;
  transition: none;
}

/* 作用：兜底像素头像居中显示。 */
.preview-skin__render--fallback {
  object-fit: contain;
  padding: 16px;
  cursor: default;
}

/* 作用：拖拽提示——底部居中弱化小字。 */
.preview-skin__hint {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: var(--preview-text-soft);
  pointer-events: none;
  opacity: 0.8;
}

/* 作用：信息区纵向排布。 */
.preview-skin__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 作用：玩家名行——铜黄、带在线状态点。 */
.preview-skin__name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  color: var(--preview-accent);
}

/* 作用：在线状态点——在线铜黄实心，离线灰描边。 */
.preview-skin__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--preview-accent);
}

.preview-skin__dot.--offline {
  background: transparent;
  border: 1px solid var(--preview-text-soft);
}

/* 作用：基本信息字段表——字段名弱化、值强调。 */
.preview-skin__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 16px;
  margin: 0;
}

.preview-skin__fields div {
  display: flex;
  gap: 8px;
}

.preview-skin__fields dt {
  color: var(--preview-text-soft);
  font-size: 13px;
}

.preview-skin__fields dd {
  margin: 0;
  color: var(--preview-text);
  font-size: 13px;
}

/* 作用：玩家签名语录。 */
.preview-skin__motto {
  margin: 0;
  font-size: 13px;
  font-style: italic;
  color: var(--preview-text-soft);
}

/* 作用：头像图——右上角悬浮圆形。 */
.preview-skin__avatar {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--preview-accent);
  object-fit: cover;
  background: var(--preview-bg);
}

/* 作用：TODO 提示。 */
.preview-skin__note {
  margin: 16px 0 0;
}
</style>
