<script setup>
import { computed, onMounted, ref } from 'vue'
import { pointsApi } from '@/api/points'
import ManagementHeading from '@/components/ManagementHeading.vue'
import { errorMessage, fieldErrors } from '@/utils/errors'

const search = ref('')
const players = ref([])
const count = ref(0)
const page = ref(1)
const hasNext = ref(false)
const hasPrevious = ref(false)
const loading = ref(false)
const loadError = ref('')
const selected = ref(null)
const form = ref({ amount: 10, reason: '', note: '' })
const errors = ref({})
const saving = ref(false)
const message = ref('')
const actionError = ref('')

const canSubmit = computed(() => selected.value && Number(form.value.amount) > 0 && form.value.reason.trim())

async function load(nextPage = 1) {
  loading.value = true
  loadError.value = ''
  try {
    const res = await pointsApi.manageAccounts({ search: search.value.trim() || undefined, page: nextPage })
    const data = res.data.data
    players.value = data.results || []
    count.value = data.count || 0
    page.value = nextPage
    hasNext.value = Boolean(data.next)
    hasPrevious.value = Boolean(data.previous)
  } catch (e) {
    loadError.value = errorMessage(e, '读取玩家列表失败')
  } finally {
    loading.value = false
  }
}

function applySearch() {
  selected.value = null
  load(1)
}

function selectPlayer(player) {
  selected.value = player
  errors.value = {}
  actionError.value = ''
  message.value = ''
}

async function submit() {
  if (!canSubmit.value) return
  saving.value = true
  errors.value = {}
  actionError.value = ''
  message.value = ''
  try {
    const res = await pointsApi.grant({
      user_id: selected.value.user_id,
      amount: Number(form.value.amount),
      reason: form.value.reason.trim(),
      note: form.value.note.trim(),
    })
    const data = res.data.data
    selected.value = {
      ...selected.value,
      balance: data.account.balance,
      total_granted: data.account.total_granted,
    }
    message.value = `已向 ${data.account.username} 发放 ${data.grant.amount} 分`
    form.value = { amount: 10, reason: '', note: '' }
    await load(page.value)
  } catch (e) {
    errors.value = fieldErrors(e)
    actionError.value = errorMessage(e, '发放积分失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => load())
</script>

<template>
  <ManagementHeading title="把认可，发给玩家。" />
  <div class="split-layout">
    <section
      class="panel"
      :aria-busy="loading"
      aria-label="选择玩家"
    >
      <div class="panel-heading">
        <h2>选择玩家</h2>
        <span class="text-muted">{{ count }} 人</span>
      </div>
      <form
        class="search-form"
        role="search"
        @submit.prevent="applySearch"
      >
        <input
          v-model="search"
          class="form-input"
          type="search"
          placeholder="搜索用户名或邮箱"
          aria-label="搜索玩家"
        >
        <button
          class="btn-secondary"
          type="submit"
          :disabled="loading"
        >
          搜索
        </button>
      </form>
      <p
        v-if="loadError"
        class="alert alert-error"
      >
        {{ loadError }}
      </p>
      <div class="grant-player-list">
        <button
          v-for="player in players"
          :key="player.user_id"
          type="button"
          class="list-row"
          :aria-pressed="selected?.user_id === player.user_id"
          @click="selectPlayer(player)"
        >
          <span>
            <strong>{{ player.username }}</strong>
            <small>{{ player.email || '未填写邮箱' }}</small>
          </span>
          <span class="grant-player-list__balance">{{ player.balance }} 分</span>
        </button>
      </div>
      <div class="grant-pagination">
        <button
          class="btn-secondary"
          type="button"
          :disabled="loading || !hasPrevious"
          @click="load(page - 1)"
        >
          上一页
        </button>
        <button
          class="btn-secondary"
          type="button"
          :disabled="loading || !hasNext"
          @click="load(page + 1)"
        >
          下一页
        </button>
      </div>
    </section>

    <section
      class="panel"
      aria-labelledby="grant-title"
    >
      <div class="panel-heading">
        <h2 id="grant-title">
          发放积分
        </h2>
      </div>
      <p
        v-if="!selected"
        class="text-muted"
      >
        从左侧选择一位玩家。
      </p>
      <template v-else>
        <div class="grant-target">
          <span>发放给</span>
          <strong>{{ selected.username }}</strong>
          <span>当前 {{ selected.balance }} 分</span>
        </div>
        <form
          class="grant-form"
          @submit.prevent="submit"
        >
          <label class="form-group">
            <span class="form-label">积分数量</span>
            <input
              v-model="form.amount"
              class="form-input"
              :class="{ error: errors.amount }"
              type="number"
              min="1"
              max="1000000"
              required
            >
            <span
              v-if="errors.amount"
              class="form-error"
            >{{ errors.amount }}</span>
          </label>
          <label class="form-group">
            <span class="form-label">发放原因</span>
            <input
              v-model="form.reason"
              class="form-input"
              :class="{ error: errors.reason }"
              maxlength="120"
              placeholder="例如：社区活动、内容贡献"
              required
            >
            <span
              v-if="errors.reason"
              class="form-error"
            >{{ errors.reason }}</span>
          </label>
          <label class="form-group">
            <span class="form-label">备注（可选）</span>
            <textarea
              v-model="form.note"
              class="form-input"
              maxlength="240"
              rows="3"
            />
          </label>
          <p
            v-if="actionError"
            class="alert alert-error"
          >
            {{ actionError }}
          </p>
          <p
            v-if="message"
            class="alert alert-success"
          >
            {{ message }}
          </p>
          <button
            class="btn-primary"
            type="submit"
            :disabled="saving || !canSubmit"
          >
            {{ saving ? '发放中…' : '确认发放' }}
          </button>
        </form>
      </template>
    </section>
  </div>
</template>

<style scoped>
.grant-player-list {
  max-height: 520px;
  overflow-y: auto;
}

.grant-player-list .list-row {
  align-items: flex-start;
}

.grant-player-list small {
  display: block;
  margin-top: 4px;
  color: var(--text-soft);
  font-size: 12px;
}

.grant-player-list__balance {
  flex: 0 0 auto;
  color: var(--brand);
  font-size: 13px;
}

.grant-pagination {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.grant-target {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-soft);
  font-size: 13px;
  color: var(--text-soft);
}

.grant-target strong {
  color: var(--brand);
}

.grant-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.grant-form .btn-primary {
  align-self: flex-start;
  margin-top: 8px;
}
</style>
