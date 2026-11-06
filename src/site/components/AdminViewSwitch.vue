<script setup>
/**
 * 文件用途：管理员"切换成普通玩家视角"开关，固定在屏幕左下角，全站都能用
 * 只有账号本身是管理员（isRealAdmin）时才显示：
 *  - 管理员视角：点一下切换成普通玩家视角——导航里的"社区管理"、个人中心的"进入管理区"、管理员标记都隐藏；
 *  - 普通玩家视角：按钮变成醒目的橙色"正在以普通玩家视角查看 · 切回管理员"，点一下恢复。
 * 只影响前端显示（services/account.js 的 viewAsPlayer），不改变账号权限，也不影响后端接口。
 */
import { watch } from 'vue'
import { isRealAdmin, setViewAsPlayer, viewAsPlayer } from '../services/account'

// 管理员退出登录（或会话失效）后，清掉"玩家视角"，下次登录回到管理员视角
watch(isRealAdmin, (now, before) => {
  if (before && !now) setViewAsPlayer(false)
})
</script>

<template>
  <button
    v-if="isRealAdmin"
    class="view-switch"
    :class="{ player: viewAsPlayer }"
    type="button"
    :aria-pressed="viewAsPlayer"
    :title="viewAsPlayer ? '切回管理员视角' : '切换成普通玩家视角，查看普通玩家看到的效果'"
    @click="setViewAsPlayer(!viewAsPlayer)"
  >
    <span
      class="dot"
      aria-hidden="true"
    />
    <span v-if="viewAsPlayer">正在以普通玩家视角查看 · 切回管理员</span>
    <span v-else>管理员视角 · 切换成普通玩家</span>
  </button>
</template>

<style scoped>
.view-switch {
  position: fixed;
  left: 12px;
  bottom: 12px;
  z-index: 1000; /* 在页面和导航栏之上、转场（1200）之下 */
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: calc(100vw - 24px);
  padding: 7px 12px;
  border: 0;
  font: inherit;
  font-size: 13px;
  color: #fff3c4;
  background: rgba(20, 18, 14, 0.9);
  box-shadow: 0 0 0 2px var(--outline), inset 0 0 0 2px rgba(232, 178, 74, 0.5);
  cursor: pointer;
}
.view-switch:hover { color: #fff; box-shadow: 0 0 0 2px var(--outline), inset 0 0 0 2px var(--brass); }
.dot { width: 10px; height: 10px; background: var(--brass); box-shadow: 0 0 0 2px var(--outline); }
.player { color: #1a1206; background: #ffb347; box-shadow: 0 0 0 2px var(--outline), 0 0 18px rgba(255, 179, 71, 0.5); }
.player .dot { background: #4fd16a; }
@media (max-width: 640px) {
  .view-switch { font-size: 12px; padding: 6px 10px; }
}
</style>
