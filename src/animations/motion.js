import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/** True when the user asked the OS for reduced motion. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Run GSAP setup inside a Vue component lifecycle and revert everything on unmount.
 * `setup` receives a small toolkit plus the elements selector scope.
 */
export function useMotionContext(rootRef, setup) {
  let ctx = null

  onMounted(() => {
    if (!rootRef || !rootRef.value) return
    const reduced = prefersReducedMotion()
    ctx = gsap.context(() => {
      setup({
        gsap,
        ScrollTrigger,
        reduced,
        root: rootRef.value,
        refresh: () => ScrollTrigger.refresh(),
      })
    }, rootRef.value)
    // Let fonts/layout settle before measuring scroll positions.
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}

/** Smoothly scroll to an element id, respecting reduced motion. */
export function scrollToId(id) {
  const el = typeof id === 'string' ? document.getElementById(id) : id
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}
