/**
 * 文件用途：页面转场的全局调度（模块单例，不依赖 Pinia）
 * 作用：PageTransition 组件挂载时把自己的 play() 注册进来，其他地方通过这里调用：
 *  - playTransition({ onCovered })：播放一次完整转场，屏幕被完全盖住时调用 onCovered（在这里切换页面），
 *    返回的 Promise 在转场彻底结束（新页面完全揭开）时 resolve。
 *    加载页 → 索引页就是用它：onCovered 里卸载加载页。
 *  - coverScreen()：给路由守卫用（router/index.js 的 beforeEach），等屏幕盖住再放行路由切换。
 *    导航栏点击、浏览器前进/后退、代码里 router.push 都自动走同一个转场。
 *  - whenTransitionDone()：页面里需要"等转场揭开后再播入场动画"时使用。
 *  - setEffectRunning(promise)：专属转场（site/transitions/）开始时登记，揭开后 promise resolve；
 *    whenTransitionDone() / isTransitionRunning() 也会把它算进去。
 */
let player = null
let running = null
let effect = null // 正在播放的专属转场（Promise），没有时为 null

export function setEffectRunning(promise) {
  effect = promise
  promise.finally(() => {
    if (effect === promise) effect = null
  })
}

export function registerTransition(play) {
  player = play
  return () => {
    if (player === play) player = null
  }
}

export function playTransition({ onCovered, kind = 'brand' } = {}) {
  // 没有播放器（组件未挂载）或已在播放：不叠加第二个转场，直接切换
  if (!player || running) {
    onCovered?.()
    return running || Promise.resolve()
  }
  running = new Promise((resolve) => {
    player({
      kind,
      onCovered: () => onCovered?.(),
      onComplete: () => {
        running = null
        resolve()
      },
    })
  })
  return running
}

export function coverScreen() {
  return new Promise((resolve) => {
    playTransition({ onCovered: resolve, kind: 'page' })
  })
}

export function whenTransitionDone() {
  if (!running && !effect) return Promise.resolve()
  return Promise.all([running, effect]).then(() => undefined)
}

export function isTransitionRunning() {
  return !!running || !!effect
}
