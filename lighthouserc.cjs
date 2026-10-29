/**
 * Lighthouse CI 配置，供 Jenkins 阶段「Lighthouse 性能检测」使用。
 *
 * 使用 .cjs 后缀：package.json 声明了 "type": "module"，若用 .js 后缀，
 * 本文件里的 module.exports 会被当作 ESM 解析而报错，LHCI 将无法加载配置。
 *
 * 构建产物需以 base=/ 生成（见 Jenkinsfile 的「构建项目」阶段），
 * 因为 staticDistDir 会把 dist 直接托管在站点根路径；
 * 线上 GitHub Pages 的 /MCTP-Frontend/ 前缀仍由 vite.config.js 控制。
 */
module.exports = {
  ci: {
    collect: {
      // 直接托管 dist，无需额外启动 web server
      staticDistDir: './dist',
      // 跑 3 次取中位数，降低单次抖动导致的误判
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      // 报告上传到 Lighthouse 官方临时存储，构建日志里会打印可访问链接；约 7 天过期
      target: 'temporary-public-storage',
    },
  },
}
