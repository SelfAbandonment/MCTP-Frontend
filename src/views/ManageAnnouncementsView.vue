<script setup>
import { onMounted, ref } from 'vue'
import { communityApi } from '@/api/community'
import ManagementHeading from '@/components/ManagementHeading.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import { usePagedResource } from '@/composables/usePagedResource'
import { errorMessage, fieldErrors, formatDate } from '@/utils/errors'

const { items, page, count, hasNext, hasPrevious, loading, error, load, retry } = usePagedResource(communityApi.manageAnnouncements)
const selectedId = ref(null)
const form = ref(emptyForm())
const errors = ref({})
const message = ref('')
const actionError = ref('')
const saving = ref(false)
const confirmingDelete = ref(false)

function emptyForm() {
  return { title: '', summary: '', body: '', is_published: false, published_at: '' }
}

function select(item = null) {
  selectedId.value = item?.id ?? null
  let localDate = ''
  if (item?.published_at) {
    const date = new Date(item.published_at)
    localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  }
  form.value = item ? {
    title: item.title, summary: item.summary, body: item.body,
    is_published: item.is_published, published_at: localDate,
  } : emptyForm()
  errors.value = {}
  actionError.value = ''
  message.value = ''
  confirmingDelete.value = false
}

async function save() {
  saving.value = true
  errors.value = {}
  actionError.value = ''
  message.value = ''
  try {
    const data = {
      ...form.value,
      published_at: form.value.published_at ? new Date(form.value.published_at).toISOString() : null,
    }
    const res = selectedId.value
      ? await communityApi.updateAnnouncement(selectedId.value, data)
      : await communityApi.createAnnouncement(data)
    select(res.data.data)
    message.value = '公告已保存'
    await load(page.value)
  } catch (e) {
    errors.value = fieldErrors(e)
    actionError.value = errorMessage(e, '公告保存失败')
  } finally {
    saving.value = false
  }
}

async function remove() {
  saving.value = true
  actionError.value = ''
  message.value = ''
  try {
    await communityApi.deleteAnnouncement(selectedId.value)
    select()
    message.value = '公告已删除'
    await load(items.value.length === 1 && page.value > 1 ? page.value - 1 : page.value)
  } catch (e) {
    actionError.value = errorMessage(e, '公告删除失败')
  } finally {
    saving.value = false
    confirmingDelete.value = false
  }
}

onMounted(() => load())
</script>

<template>
  <ManagementHeading title="把新消息，带给大家。" />
  <div class="split-layout">
    <section
      :aria-busy="loading"
      aria-label="公告列表"
    >
      <div class="panel-heading">
        <h2>社区公告</h2>
        <button
          class="btn-secondary"
          :disabled="saving"
          @click="select()"
        >
          新建公告 +
        </button>
      </div>
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
        正在读取公告…
      </p>
      <p
        v-else-if="!items.length"
        class="empty-state"
      >
        还没有公告。从右侧写下第一条消息。
      </p>
      <button
        v-for="item in items"
        :key="item.id"
        class="list-row"
        :aria-pressed="selectedId === item.id"
        :disabled="saving"
        @click="select(item)"
      >
        <span>
          <strong>{{ item.title }}</strong>
          <small>{{ formatDate(item.updated_at) }}</small>
        </span>
        <span :class="['badge', { 'badge-muted': !item.is_published }]">
          {{ !item.is_published ? '草稿' : item.published_at && new Date(item.published_at) > new Date() ? '定时' : '已发布' }}
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
      aria-labelledby="announcement-editor-title"
    >
      <div class="panel-heading">
        <h2 id="announcement-editor-title">
          {{ selectedId ? '编辑公告' : '新建公告' }}
        </h2>
      </div>
      <p
        v-if="message"
        class="alert alert-success"
        role="status"
      >
        {{ message }}
      </p>
      <p
        v-if="actionError"
        class="alert alert-error"
        role="alert"
      >
        {{ actionError }}
      </p>
      <form @submit.prevent="save">
        <fieldset :disabled="saving">
          <div
            v-for="field in [{key: 'title', label: '标题', max: 160}, {key: 'summary', label: '摘要（可选）', max: 240}]"
            :key="field.key"
            class="form-group"
          >
            <label
              class="form-label"
              :for="`announcement-${field.key}`"
            >{{ field.label }}</label>
            <input
              :id="`announcement-${field.key}`"
              v-model="form[field.key]"
              class="form-input"
              :maxlength="field.max"
              :required="field.key === 'title'"
              :aria-invalid="!!errors[field.key]"
            >
            <span
              v-if="errors[field.key]"
              class="form-error"
            >{{ errors[field.key] }}</span>
          </div>
          <div class="form-group">
            <label
              class="form-label"
              for="announcement-body"
            >正文</label>
            <textarea
              id="announcement-body"
              v-model="form.body"
              class="form-input"
              required
              rows="8"
              :aria-invalid="!!errors.body"
            />
            <span
              v-if="errors.body"
              class="form-error"
            >{{ errors.body }}</span>
          </div>
          <label class="check-label">
            <input
              v-model="form.is_published"
              type="checkbox"
            >
            发布到社区官网
          </label>
          <div class="form-group">
            <label
              class="form-label"
              for="announcement-publish-time"
            >发布时间（本地时间，留空则发布时立即生效）</label>
            <input
              id="announcement-publish-time"
              v-model="form.published_at"
              class="form-input"
              type="datetime-local"
            >
            <span
              v-if="errors.published_at"
              class="form-error"
            >{{ errors.published_at }}</span>
          </div>
          <div class="actions">
            <button
              class="btn-primary"
              type="submit"
            >
              {{ saving ? '保存中…' : '保存公告 ↗' }}
            </button>
            <button
              v-if="selectedId && !confirmingDelete"
              class="text-button"
              type="button"
              @click="confirmingDelete = true"
            >
              删除
            </button>
          </div>
        </fieldset>
      </form>
      <div
        v-if="confirmingDelete"
        class="delete-confirm"
        role="alert"
      >
        <p>确定删除这条公告？此操作不可撤销。</p>
        <div class="actions">
          <button
            class="btn-danger"
            :disabled="saving"
            @click="remove"
          >
            确认删除
          </button>
          <button
            class="btn-secondary"
            :disabled="saving"
            @click="confirmingDelete = false"
          >
            取消
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
fieldset { border: 0; min-width: 0; }
form { margin-top: 4px; }
section[aria-label='公告列表'] .list-row:first-of-type { border-top: 1px solid var(--line); }
section[aria-label='公告列表'] .empty-state { margin-top: 4px; }
.panel-heading h2 {
  font-family: var(--font-display);
  font-size: clamp(24px, 2.4vw, 32px);
  font-weight: 400;
  line-height: 1.1;
}
.delete-confirm {
  margin-top: 22px;
  padding: 18px;
  border: 1px solid #ff7a6640;
  border-radius: var(--radius);
  background: #2a121059;
  font-size: 13px;
}
.delete-confirm p { margin-bottom: 15px; }
@media (max-width: 900px) {
  .delete-confirm { margin-top: 18px; }
}
</style>
