# 智能鑫AI股票投资助手

一个基于Vite + React的现代化股票投资辅助应用，提供AI智能选股、实时行情、投资教育等功能。

## 功能特性

- 📱 **原生手机应用体验** - 完美模拟手机界面交互
- 📊 **实时行情展示** - 上证指数、深证成指实时更新
- 🤖 **AI智能选股** - 大数据分析推荐投资机会
- 📰 **财经资讯** - AI推送相关财经新闻
- 📚 **投资教育** - 分层级股票投资课程
- 👥 **投资社区** - 与股友交流互动
- ⭐ **自选股管理** - 个性化股票监控

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **路由管理**: React Router
- **图标库**: Font Awesome 6

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── PhoneLayout.jsx
│   ├── StatusBar.jsx
│   ├── Header.jsx
│   └── Navigation.jsx
├── pages/              # 页面组件
│   ├── HomePage.jsx    # 首页
│   ├── LoginPage.jsx   # 登录页
│   ├── MarketPage.jsx  # 股海波涛
│   ├── AIPicksPage.jsx # AI智能选股
│   ├── NewsPage.jsx    # 速递时事
│   ├── EducationPage.jsx # 谈股论经
│   ├── FavoritesPage.jsx # 自选嗨吧
│   ├── InteractionPage.jsx # 互动点盘
│   ├── FriendsPage.jsx # 股友
│   └── ProfilePage.jsx # 我的
├── App.jsx             # 主应用组件
├── main.jsx           # 入口文件
└── index.css          # 全局样式
```

## 页面功能

### 首页 (/)
- 欢迎界面和市场概览
- 核心功能快捷入口
- 实时指数显示

### 登录页 (/login)
- 用户登录/注册
- 本地存储用户数据

### 股海波涛 (/market)
- 热门股票行情
- 大盘指数分析

### AI智能选股 (/aipicks)
- AI推荐股票列表
- 推荐理由和置信度

### 速递时事 (/news)
- 财经新闻推送
- 热点资讯显示

### 谈股论经 (/education)
- 投资教育课程
- 分层级学习内容

### 自选嗨吧 (/favorites)
- 个人股票收藏
- 投资社区讨论

### 互动点盘 (/interaction)
- 投资话题讨论
- 实时互动交流

### 股友 (/friends)
- 投资达人列表
- 好友关系管理

### 我的 (/profile)
- 个人资料管理
- 账号设置

## 开发说明

### 样式约定

项目使用Tailwind CSS，主要样式规则：
- 手机容器: `.phone-container`
- 状态栏: `.status-bar`
- 内容区域: `.scrollable-content`
- 底部导航: `.fixed-bottom-nav`

### 组件设计

- **PhoneLayout**: 手机壳和基础布局
- **StatusBar**: 状态栏（时间、信号等）
- **Header**: 应用头部和登录状态
- **Navigation**: 底部导航栏

### 数据存储

使用localStorage保存用户数据和设置：
- `currentUser`: 当前登录用户
- `users`: 用户账号列表

## 部署

构建后的文件可部署到任何静态网站托管服务：

```bash
npm run build
# 将 dist 目录上传到服务器
```

## 许可证

MIT License

---

**智能鑫AI** - 让投资更简单，让财富更智能