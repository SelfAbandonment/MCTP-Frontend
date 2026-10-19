<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { communityApi } from '@/api/community'
import { useAuthStore } from '@/stores/auth'
import { usePagedResource } from '@/composables/usePagedResource'
import { errorMessage, formatDate } from '@/utils/errors'
import ManagementHeading from '@/components/ManagementHeading.vue'
import PaginationControls from '@/components/PaginationControls.vue'

const auth = useAuthStore()
const search = ref('')
const { items, page, count, hasNext, hasPrevious, loading, error, load, retry } = usePagedResource(communityApi.players)
const selected = ref(null)
const detailLoading = ref(false)
const detailError = ref('')
const message = ref('')
const saving = ref(false)
const confirming = ref(false)
let detailGeneration = 0
const protectedAccount = computed(() => !selected.value || selected.value.id === auth.user?.id || selected.value.is_staff || selected.value.is_superuser)

async function select(player) {
  const generation = ++detailGeneration
  selected.value = null
  detailError.value = ''
  message.value = ''
  confirming.value = false
  detailLoading.value = true
  try {
    const res = await communityApi.player(player.id)
    if (generation === detailGeneration) selected.value = res.data.data
  } catch (e) {
    if (generation === detailGeneration) detailError.value = errorMessage(e, '读取玩家详情失败，请重新选择玩家')
  } finally {
    if (generation === detailGeneration) detailLoading.value = false
  }
}

async function toggleActive() {
  saving.value = true
  detailError.value = ''
  message.value = ''
  try {
    const res = await communityApi.updatePlayer(selected.value.id, { is_active: !selected.value.is_active })
    selected.value = res.data.data
    message.value = selected.value.is_active ? '账号已恢复' : '账号已停用'
    await load(page.value)
  } catch (e) {
    detailError.value = errorMessage(e, '更新账号状态失败')
  } finally {
    saving.value = false
    confirming.value = false
  }
}

function find() {
  detailGeneration++
  selected.value = null
  detailLoading.value = false
  detailError.value = ''
  message.value = ''
  load(1, { search: search.value.trim() })
}

onMounted(() => load())
onUnmounted(() => detailGeneration++)
</script>

<template>
  <ManagementHeading title="照看这个世界的伙伴。" />
  <div class="split-layout">
    <section aria-label="玩家列表">
      <form
        class="search-form"
        @submit.prevent="find"
      >
        <input
          v-model="search"
          class="form-input"
          aria-label="搜索玩家"
          placeholder="用户名、邮箱或我的世界账号"
          maxlength="150"
          :disabled="saving"
        >
        <button
          class="btn-primary"
          type="submit"
          :disabled="saving"
        >
          搜索
        </button>
      </form>
      <div
        v-if="error"
        class="alert alert-error"
        role="alert"
      >
        {{ error }}
        <button
          class="text-button"
          @click="retry"
        >
          重试
        </button>
      </div>
      <p
        v-else-if="loading"
        class="empty-state"
        role="status"
      >
        正在寻找伙伴…
      </p>
      <p
        v-else-if="!items.length"
        class="empty-state"
      >
        没有找到符合条件的玩家。
      </p>
      <button
        v-for="player in items"
        :key="player.id"
        class="list-row"
        :aria-pressed="selected?.id === player.id"
        :disabled="saving"
        @click="select(player)"
      >
        <span>
          <strong>{{ player.username }}</strong>
          <small>{{ player.minecraft?.username || '尚未绑定我的世界' }}</small>
        </span>
        <span :class="['badge', { 'badge-muted': !player.is_active }]">
          {{ player.is_staff ? '管理者' : player.is_active ? '正常' : '已停用' }}
        </span>
      </button>
      <PaginationControls
        :page="page"
        :count="count"
        :has-next="hasNext"
        :has-previous="hasPrevious"
        :loading="loading || saving"
        @change="load"
      />
    </section>
    <section
      class="panel"
      aria-label="玩家详情"
      :aria-busy="detailLoading"
    >
      <p
        v-if="detailError"
        class="alert alert-error"
        role="alert"
      >
        {{ detailError }}
      </p>
      <p
        v-if="message"
        class="alert alert-success"
        role="status"
      >
        {{ message }}
      </p>
      <p
        v-if="detailLoading"
        class="empty-state"
      >
        读取玩家详情…
      </p>
      <template v-else-if="selected">
        <div class="panel-heading">
          <h2>{{ selected.username }}</h2>
          <span class="badge">{{ selected.is_active ? '正常' : '已停用' }}</span>
        </div>
        <dl class="detail-list">
          <div><dt>邮箱</dt><dd>{{ selected.email || '未填写' }}</dd></div>
          <div><dt>加入时间</dt><dd>{{ formatDate(selected.date_joined) }}</dd></div>
          <div><dt>最近登录</dt><dd>{{ formatDate(selected.last_login) }}</dd></div>
          <div><dt>我的世界</dt><dd>{{ selected.minecraft?.username || '未绑定' }}</dd></div>
          <div v-if="selected.minecraft">
            <dt>游戏编号</dt><dd>{{ selected.minecraft.uuid }}</dd>
          </div>
        </dl>
        <p
          v-if="protectedAccount"
          class="protected-note"
        >
          自己及管理者账号受保护，不能在此更改状态。
        </p>
        <div
          v-else
          class="player-actions"
        >
          <template v-if="confirming">
            <p>确定{{ selected.is_active ? '停用' : '恢复' }}「{{ selected.username }}」？</p>
            <p
              v-if="selected.is_active"
              class="text-muted"
            >
              停用后该账号将无法登录和访问受保护接口。
            </p>
            <div class="actions">
              <button
                class="btn-danger"
                :disabled="saving"
                @click="toggleActive"
              >
                {{ saving ? '更新中…' : '确认更改' }}
              </button>
              <button
                class="btn-secondary"
                :disabled="saving"
                @click="confirming = false"
              >
                取消
              </button>
            </div>
          </template>
          <button
            v-else
            class="btn-secondary"
            @click="confirming = true"
          >
            {{ selected.is_active ? '停用账号' : '恢复账号' }}
          </button>
        </div>
      </template>
      <p
        v-else-if="!detailError"
        class="empty-state"
      >
        <strong>认识每一位伙伴。</strong>
        从列表选择一位玩家，查看账号与绑定信息。
      </p>
    </section>
  </div>
</template>

<style scoped>
section[aria-label='玩家列表'] .list-row:first-of-type { border-top: 1px solid var(--line); }
section[aria-label='玩家列表'] .empty-state { margin-top: 4px; }
.panel-heading h2 {
  font-family: var(--font-display);
  font-size: clamp(24px, 2.4vw, 32px);
  font-weight: 400;
  line-height: 1.1;
  overflow-wrap: anywhere;
}
.search-form input { flex: 1; }
.protected-note,
.player-actions { margin-top: 26px; font-size: 12px; }
.protected-note {
  padding: 14px 16px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius);
  color: var(--text-soft);
}
.player-actions {
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.player-actions p { margin-bottom: 12px; }
.list-row strong { max-width: 260px; }
@media (max-width: 900px) {
  .protected-note,
  .player-actions { margin-top: 20px; }
  .list-row strong { max-width: none; }
}
</style>
