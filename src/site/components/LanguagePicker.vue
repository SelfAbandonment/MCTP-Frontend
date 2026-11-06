<script setup>
import { LANGS, locale, setLocale } from '../i18n'
</script>

<template>
  <label class="nav-language">
    <span>导航语言</span>
    <select
      :value="locale"
      @change="setLocale($event.target.value)"
    >
      <option
        v-for="language in LANGS"
        :key="language.code"
        :value="language.code"
      >{{ language.name }}</option>
    </select>
    <small>仅切换主导航，页面内容为中文。</small>
  </label>
</template>

<style scoped>
.nav-language { display: grid; gap: 8px; padding: 12px 10px 4px; border-top: 1px solid var(--casing-hi); font-size: 14px; }
select { width: 100%; min-height: 44px; padding: 8px; background: #151517; color: #fff; border: 2px solid var(--casing-hi); font: inherit; }
small { font-family: var(--font-body); color: #c4c4c9; line-height: 1.6; }
</style>
