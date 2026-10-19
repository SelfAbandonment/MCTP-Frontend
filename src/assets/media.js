/**
 * Central media map. Every public asset path goes through `asset()` so the
 * Vite `base` (GitHub Pages: /MCTP-Frontend/) is applied consistently.
 */
const base = import.meta.env.BASE_URL || '/'

export function asset(path) {
  return `${base}${String(path).replace(/^\/+/, '')}`
}

const mediaFile = (path) => asset(`media/${path}`)

export const media = {
  hero: [
    { video: mediaFile('hero/hero-4.mp4'), poster: mediaFile('posters/hero-4.webp'), name: '玩家' },
    { video: mediaFile('hero/hero-2.mp4'), poster: mediaFile('posters/hero-2.webp'), name: '市集' },
    { video: mediaFile('hero/hero-1.mp4'), poster: mediaFile('posters/hero-1.webp'), name: '浮岛' },
    { video: mediaFile('hero/hero-3.mp4'), poster: mediaFile('posters/hero-3.webp'), name: '花林' },
  ],
  features: [
    {
      video: mediaFile('features/feature-1.mp4'),
      poster: mediaFile('posters/feature-1.webp'),
      image: mediaFile('posters/feature-1.webp'),
      title: '原野',
      cta: '走走',
    },
    {
      video: mediaFile('features/feature-2.mp4'),
      poster: mediaFile('posters/feature-2.webp'),
      image: mediaFile('posters/feature-2.webp'),
      title: '市集',
      cta: '逛逛',
    },
    {
      video: mediaFile('features/feature-3.mp4'),
      poster: mediaFile('posters/feature-3.webp'),
      image: mediaFile('posters/feature-3.webp'),
      title: '浮岛',
      cta: '登岛',
    },
    {
      video: mediaFile('features/feature-4.mp4'),
      poster: mediaFile('posters/feature-4.webp'),
      image: mediaFile('posters/feature-4.webp'),
      title: '玩家',
      cta: '一起',
    },
    {
      video: mediaFile('features/feature-5.mp4'),
      poster: mediaFile('posters/feature-5.webp'),
      image: mediaFile('posters/feature-5.webp'),
      title: '夜色',
      cta: '夜游',
    },
  ],
  about: mediaFile('img/about.webp'),
  entrance: mediaFile('img/entrance.webp'),
  contact: {
    one: mediaFile('img/contact-1.webp'),
    two: mediaFile('img/contact-2.webp'),
    three: mediaFile('img/contact-3.webp'),
  },
}
