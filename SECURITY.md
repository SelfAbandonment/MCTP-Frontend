# 安全策略

## 支持的版本

| 分支 / 版本 | 状态 |
| --- | --- |
| `main`（线上） | ✅ 接受修复 |
| `develop` | ⚠️ 预发布，仅测试用途 |
| 其他分支 | ❌ 不保证 |

## 报告漏洞

请不要在公开 issue、讨论区或 PR 中披露漏洞细节。任选一种方式：

1. GitHub 私密报告：https://github.com/SelfAbandonment/MCTP-Frontend/security/advisories/new
2. 邮件：205823393@qq.com，标题加 `[SECURITY]`

报告里请包含：影响范围、复现步骤、最小验证代码或截图、可能的修复方向。

我们会在 3 个工作日内确认收到；修复并发布后再公开细节。

## 重点关注

- XSS（公告正文渲染、用户输入回显）
- 令牌存储与刷新逻辑（localStorage / sessionStorage）
- 依赖漏洞（Dependabot 会开 PR）
- 构建产物中泄露的密钥或私密地址

## 不在范围

- 需要物理接触设备的问题
- 已在 Dependabot PR 中处理的依赖告警
- 社会工程学
