# MCTP Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/github/actions/workflow/status/SelfAbandonment/MCTP-Frontend/deploy.yml?label=deploy&logo=github" alt="Deploy Status" />
  <img src="https://img.shields.io/github/actions/workflow/status/SelfAbandonment/MCTP-Frontend/lint.yml?label=lint&logo=github" alt="Lint Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
</p>

MCTP 项目的前端 Dashboard，基于 Vue 3 + Vite 构建，实时展示后端 API 健康状态。

## 在线访问

| 地址 | 说明 |
|------|------|
| [Frontend](https://selfabandonment.github.io/MCTP-Frontend/) | GitHub Pages 部署 |
| [Backend API](https://mctp-api.onrender.com) | Django REST Framework |
| [Swagger UI](https://mctp-api.onrender.com/api/docs/) | 交互式 API 文档 |
| [ReDoc](https://mctp-api.onrender.com/api/redoc/) | ReDoc API 文档 |

## 功能

- 实时 API 健康状态监控（每 30 秒自动刷新）
- API 端点列表展示
- 技术栈信息面板
- 快速链接导航

## 目录结构

```
MCTP-Frontend/
├── .github/
│   ├── ISSUE_TEMPLATE/       # Issue 模板
│   ├── workflows/
│   │   ├── deploy.yml        # 部署到 GitHub Pages
│   │   └── lint.yml          # ESLint 检查
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                   # 静态资源
├── src/
│   ├── components/           # Vue 组件
│   ├── App.vue
│   └── main.js
├── .env.example              # 环境变量示例
├── eslint.config.js          # ESLint 配置
├── vite.config.js            # Vite 配置
└── package.json
```

## 本地开发

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 启动步骤

```bash
# 克隆仓库
git clone https://github.com/SelfAbandonment/MCTP-Frontend.git
cd MCTP-Frontend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local
# 按需修改 .env.local 中的 VITE_API_BASE_URL

# 启动开发服务器
npm run dev
```

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产包 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint 并自动修复 |
| `npm run lint:check` | 运行 ESLint 检查（不修复） |

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `https://mctp-api.onrender.com` |

## 部署

推送到 `main` 分支自动触发 GitHub Actions，构建后部署到 GitHub Pages。

## 贡献

1. Fork 本仓库
2. 基于 `main` 创建 feature 分支：`git checkout -b feat/your-feature`
3. Commit 变更（遵循 [Conventional Commits](https://www.conventionalcommits.org/)）
4. Push 并发起 Pull Request

## 相关仓库

- 后端：[SelfAbandonment/MCTP-API](https://github.com/SelfAbandonment/MCTP-API)

## License

[MIT](./LICENSE)
