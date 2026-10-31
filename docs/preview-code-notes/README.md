---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_f3e2f87ed4a811f1a0da525400393706
    ReservedCode1: 53MisJEeLvK+9ddQOn17MLhshYQjWxl4j5FbBMOBUYgoisLQqgykP0Tn/hUohrUADHHBW2z+PWQwqAAVIzoOU9wJr8dhiafeyipSFkCtKtu8jN+07VSA5IY/f9irGTJ2C/YoaQDSlSqLiKwZo+HVWr67gsOiI/zUn+6t89DzKV/BKQjEPWXOcsHzPgU=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_f3e2f87ed4a811f1a0da525400393706
    ReservedCode2: 53MisJEeLvK+9ddQOn17MLhshYQjWxl4j5FbBMOBUYgoisLQqgykP0Tn/hUohrUADHHBW2z+PWQwqAAVIzoOU9wJr8dhiafeyipSFkCtKtu8jN+07VSA5IY/f9irGTJ2C/YoaQDSlSqLiKwZo+HVWr67gsOiI/zUn+6t89DzKV/BKQjEPWXOcsHzPgU=
---

# 机械动力服务器官网预览页 · 代码说明文档索引

> 本目录为 `src/preview/` 每个文件的配套说明。每份文档包含：文件路径、主要代码的「为什么写 / 作用是什么」、TODO 备注清单。

## 清单与说明

| 文档 | 内容 |
| --- | --- |
| [本轮优化记录.md](./本轮优化记录.md) | 第三轮优化：占位链接修复 / 路由懒加载 / 指令局部注册 / 日期自动计算 / Lint 清零等 |
| [待定制内容清单.md](./待定制内容清单.md) | 文案 / 素材 / 链接 / 数据接口待补项汇总（发服主填写） |
| [预览页使用说明.md](./预览页使用说明.md) | 如何预览、验证生产构建、以及如何关掉预览路由 |

## 目录与路由

| 文档 | 对应文件 |
| --- | --- |
| [previewRoutes.md](./previewRoutes.md) | `src/preview/router/previewRoutes.js` |
| [router-index.md](./router-index.md) | `src/router/index.js`（本次追加 /preview 的改动说明） |
| [main.md](./main.md) | `src/main.js`（已回退为零改动，说明指令改为局部注册的原因） |

## 指令

| 文档 | 对应文件 |
| --- | --- |
| [reveal.md](./reveal.md) | `src/preview/directives/reveal.js`（v-reveal 滚动入场动画指令） |
| [tilt.md](./tilt.md) | `src/preview/directives/tilt.js`（v-tilt 3D 卡片倾斜指令） |

## Store

| 文档 | 对应文件 |
| --- | --- |
| [themeStore.md](./themeStore.md) | `src/preview/stores/themeStore.js`（三主题 + localStorage 持久化） |
| [previewAuthStore.md](./previewAuthStore.md) | `src/preview/stores/previewAuthStore.js`（登录态模拟） |

## 样式

| 文档 | 对应文件 |
| --- | --- |
| [theme.css.md](./theme.css.md) | `src/preview/styles/theme.css`（三主题变量 + 字体） |
| [base.css.md](./base.css.md) | `src/preview/styles/base.css`（基础样式） |

## 占位素材

| 文档 | 对应文件 |
| --- | --- |
| [ad-banner.svg.md](./ad-banner.svg.md) | `src/preview/assets/placeholders/ad-banner.svg`（1200x300） |
| [avatar.svg.md](./avatar.svg.md) | `src/preview/assets/placeholders/avatar.svg`（96x96 头像） |

## 组件

| 文档 | 对应文件 |
| --- | --- |
| [IntroAnimation.md](./IntroAnimation.md) | `src/preview/components/IntroAnimation.vue`（开场动画） |
| [GearBackground.md](./GearBackground.md) | `src/preview/components/GearBackground.vue`（机械工业动态背景） |
| [CustomCursor.md](./CustomCursor.md) | `src/preview/components/CustomCursor.vue`（自定义光标） |
| [PreviewHeader.md](./PreviewHeader.md) | `src/preview/components/PreviewHeader.vue`（顶部导航） |
| [AccountArea.md](./AccountArea.md) | `src/preview/components/AccountArea.vue`（账号区两态） |
| [ThemeSwitcher.md](./ThemeSwitcher.md) | `src/preview/components/ThemeSwitcher.vue`（三主题切换） |
| [AnnouncementSection.md](./AnnouncementSection.md) | `src/preview/components/AnnouncementSection.vue`（公告区） |
| [AdBannerSection.md](./AdBannerSection.md) | `src/preview/components/AdBannerSection.vue`（广告区） |
| [PlaceholderSection.md](./PlaceholderSection.md) | `src/preview/components/PlaceholderSection.vue`（通用占位区块，第二阶段后不再用于主区块） |
| [FeatureShowcaseSection.md](./FeatureShowcaseSection.md) | `src/preview/components/FeatureShowcaseSection.vue`（玩法介绍区） |
| [DownloadSection.md](./DownloadSection.md) | `src/preview/components/DownloadSection.vue`（下载区） |
| [StatusBarSection.md](./StatusBarSection.md) | `src/preview/components/StatusBarSection.vue`（功能 A：服务器状态条） |
| [PlaytimeRankingSection.md](./PlaytimeRankingSection.md) | `src/preview/components/PlaytimeRankingSection.vue`（功能 B：在线时长排行） |
| [SkinPreviewSection.md](./SkinPreviewSection.md) | `src/preview/components/SkinPreviewSection.vue`（功能 C：皮肤预览 + 基本信息） |
| [RulesFaqSection.md](./RulesFaqSection.md) | `src/preview/components/RulesFaqSection.vue`（功能 E：规则 / FAQ 折叠） |
| [EventsTimelineSection.md](./EventsTimelineSection.md) | `src/preview/components/EventsTimelineSection.vue`（功能 F：活动预告与时间线） |
| [GuestbookSection.md](./GuestbookSection.md) | `src/preview/components/GuestbookSection.vue`（功能 G：玩家留言 / localStorage） |
| [StaffSection.md](./StaffSection.md) | `src/preview/components/StaffSection.vue`（功能 H：STAFF 管理组） |
| [PreviewFooter.md](./PreviewFooter.md) | `src/preview/components/PreviewFooter.vue`（页脚：标语 / 外链 / 版权占位） |

## 根组件

| 文档 | 对应文件 |
| --- | --- |
| [PreviewApp.md](./PreviewApp.md) | `src/preview/PreviewApp.vue`（预览页根组件） |

