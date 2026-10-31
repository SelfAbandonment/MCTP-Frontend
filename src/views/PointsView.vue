<script setup>
import { onMounted, ref } from 'vue'
import { pointsApi } from '@/api/points'
import PaginationControls from '@/components/PaginationControls.vue'
import { usePagedResource } from '@/composables/usePagedResource'
import { errorMessage, formatDate } from '@/utils/errors'

const me = ref(null)
const leaderboard = ref([])
const loading = ref(false)
const error = ref('')
const { items: grants, page, count, hasNext, hasPrevious, loading: grantsLoading, error: grantsError, load: loadGrants } = usePagedResource(pointsApi.grants)

async function load() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const [mine, board] = await Promise.all([pointsApi.me(), pointsApi.leaderboard()])
    me.value = mine.data.data
    leaderboard.value = board.data.data.results || []
    await loadGrants(1)
  } catch (e) {
    error.value = errorMessage(e, '暂时无法读取积分')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="points-hero">
    <div>
      <p class="eyebrow">
        MCTP POINTS
      </p>
      <h1>积分</h1>
      <p class="points-hero__sub">
        由社区发放，记录每一次认可。
      </p>
    </div>
    <RouterLink
      to="/dashboard"
      class="btn-secondary"
    >
      返回玩家中心
    </RouterLink>
  </section>

  <p
    v-if="error"
    class="alert alert-error"
    role="alert"
  >
    {{ error }}
  </p>

  <div class="points-grid">
    <section
      class="panel points-balance"
      aria-labelledby="points-balance-title"
    >
      <div class="panel-heading">
        <h2 id="points-balance-title">
          我的积分
        </h2>
        <span
          v-if="me"
          class="points-rank"
        >第 {{ me.rank }} 名</span>
      </div>
      <template v-if="me">
        <p class="points-balance__value">
          {{ me.account.balance }}
        </p>
        <p class="points-balance__meta">
          累计获得 {{ me.account.total_granted }} 分
        </p>
      </template>
      <p
        v-else
        class="text-muted"
      >
        {{ loading ? '读取中…' : '还没有积分记录' }}
      </p>
    </section>

    <section
      class="panel points-leaderboard"
      aria-labelledby="points-leaderboard-title"
    >
      <div class="panel-heading">
        <h2 id="points-leaderboard-title">
          积分榜
        </h2>
        <span class="text-muted">TOP {{ leaderboard.length }}</span>
      </div>
      <ol
        v-if="leaderboard.length"
        class="points-board"
      >
        <li
          v-for="entry in leaderboard"
          :key="entry.user_id"
          :class="{ 'is-me': me && entry.user_id === me.account.user_id }"
        >
          <span class="points-board__rank">{{ entry.rank }}</span>
          <span class="points-board__name">{{ entry.username }}</span>
          <span class="points-board__value">{{ entry.balance }}</span>
        </li>
      </ol>
      <p
        v-else
        class="text-muted"
      >
        还没有人收到积分。
      </p>
    </section>

    <section
      class="panel points-history"
      aria-labelledby="points-history-title"
    >
      <div class="panel-heading">
        <h2 id="points-history-title">
          发放记录
        </h2>
        <button
          class="text-button"
          :disabled="grantsLoading"
          @click="loadGrants(page)"
        >
          {{ grantsLoading ? '读取中…' : '刷新 ↻' }}
        </button>
      </div>
      <p
        v-if="grantsError"
        class="alert alert-error"
      >
        {{ grantsError }}
      </p>
      <div
        v-if="grants.length"
        class="points-history__list"
      >
        <div
          v-for="grant in grants"
          :key="grant.id"
          class="points-history__row"
        >
          <div>
            <strong>+{{ grant.amount }}</strong>
            <span>{{ grant.reason }}</span>
            <small v-if="grant.note">{{ grant.note }}</small>
          </div>
          <div class="points-history__meta">
            <span>{{ grant.granted_by || '社区' }}</span>
            <time>{{ formatDate(grant.created_at) }}</time>
          </div>
        </div>
      </div>
      <p
        v-else-if="!grantsLoading"
        class="text-muted"
      >
        还没有发放记录。
      </p>
      <PaginationControls
        v-if="count > 20"
        :page="page"
        :count="count"
        :has-next="hasNext"
        :has-previous="hasPrevious"
        :loading="grantsLoading"
        @change="loadGrants"
      />
    </section>
  </div>
</template>

<style scoped>
.points-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.points-hero h1 {
  margin-top: 6px;
  font-family: var(--font-display);
  font-size: clamp(38px, 5vw, 68px);
  font-weight: 400;
  line-height: 1;
}

.points-hero__sub {
  margin-top: 12px;
  color: var(--text-soft);
  font-size: 14px;
}

.points-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
  align-items: start;
}

.points-history {
  grid-column: 1 / -1;
}

.points-balance__value {
  font-family: var(--font-display);
  font-size: clamp(64px, 10vw, 120px);
  line-height: 0.9;
  color: var(--brand);
}

.points-balance__meta {
  margin-top: 10px;
  color: var(--text-soft);
  font-size: 13px;
}

.points-rank {
  flex: 0 0 auto;
  padding: 5px 12px;
  border: 1px solid #8ce06a44;
  border-radius: 999px;
  color: var(--brand);
  font-size: 12px;
}

.points-board {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.points-board li {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}

.points-board li.is-me {
  background: #8ce06a10;
  border-radius: 6px;
}

.points-board__rank {
  color: var(--text-soft);
  font-family: var(--font-pixel);
  font-size: 10px;
}

.points-board__value {
  color: var(--brand);
  font-weight: 700;
}

.points-history__list {
  display: flex;
  flex-direction: column;
}

.points-history__row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}

.points-history__row strong {
  margin-right: 10px;
  color: var(--brand);
}

.points-history__row small {
  display: block;
  margin-top: 4px;
  color: var(--text-soft);
}

.points-history__meta {
  flex: 0 0 auto;
  color: var(--text-soft);
  text-align: right;
  font-size: 12px;
}

.points-history__meta span,
.points-history__meta time {
  display: block;
}

@media (max-width: 800px) {
  .points-grid {
    grid-template-columns: 1fr;
  }

  .points-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .points-history__row {
    flex-direction: column;
    gap: 8px;
  }

  .points-history__meta {
    text-align: left;
  }
}
</style>
