变更说明 — 前端收藏 & Auth 同步修复

日期: 2025-12-23

概要

本次提交聚焦于：
- 将前端的收藏（favorites）按用户隔离（per-user），并通过 `AuthContext` 在登录/登出时设置当前用户 id。
- 为 mock API 层（`src/utils/api.js`）增加可注入的“当前用户 id”（`api.setCurrentUserId` / `api.getCurrentUserId`）和 token 注入接口（`api.setToken` / `api.getAuthToken`）。
- 在若干页面中（AIPicks、News、Favorites）同步并刷新收藏显示以响应用户切换。
- 清理若干 ESLint 警告，修复构建时发现的语法问题。

修改的主要文件（高层）

- src/context/AuthContext.jsx
  - 在登录/登出时调用 `api.setCurrentUserId(...)` 和 `favorites.setUserId(...)`，并注入/清理 token。

- src/utils/favorites.js
  - 改为按用户隔离的 storageKey（`userFavorites_<userId>` / `userFavorites_guest`），新增 `setUserId(userId)`。

- src/utils/api.js
  - 增加 `api.setCurrentUserId(id)` / `api.getCurrentUserId()` / `api.getAuthToken()`。
  - 将内部所有硬编码的 `currentUserId = 1` 替换为 `getCurrentUserId()`。
  - 修复因批量替换产生的语法问题并清理未使用的导入/参数。

- src/pages/AIPicksPage.jsx
  - 使用 `useAuth()` 响应 `currentUser` 变化并刷新 favorites；在添加自选时尝试同步到 `api.favorites.addFavorite(...)`（mock 后端），失败时静默忽略以保证良好 UX。

- src/pages/NewsPage.jsx, src/pages/FavoritesPage.jsx
  - 使用 `useAuth()` 并在 `currentUser` 变更时刷新/同步 favorites。

- 其余小修复
  - 移除/调整若干未使用的 imports/变量（以通过 ESLint），并把不影响逻辑的未用参数改为 `_params` 风格以满足 lint 规则。

如何在本地验证（PowerShell）

1) 启动开发服务（可在浏览器打开并手工测试登录/登出与收藏行为）

```powershell
npm run dev
```

Vite 默认在 http://localhost:5173 提供页面。

2) 验证构建与 lint（注意：在部分 Windows 环境下，直接运行 npm 脚本可能触发 PowerShell 执行策略问题，推荐通过 cmd 运行下面的命令）：

```powershell
cmd /c "npm run build"
cmd /c "npm run lint"
```

3) 快速手工验收要点
- 在未登录状态下，添加自选应写入 localStorage 的 `userFavorites_guest`；登录后，`userFavorites_<userId>` 将被使用。
- 登录（通过 UI 登录页面），确认 `AuthContext` 将 `currentUser` 写入 localStorage（但不保存明文密码）且 `api.getCurrentUserId()` 返回相应 id（可在控制台打印 API 调用验证）。
- 在 AI 选股页加自选：前端会把收藏写入 localStorage，并尝试调用 mock 后端的 `api.favorites.addFavorite`（若 mock 能匹配到对应 stock）。任何同步错误会被静默忽略以免影响前端体验。

后续建议（非必需）

- 若希望把收藏逻辑更贴合真实后端，可把页面收藏读写全部迁移为走 `api.favorites.*`（将 `favoritesManager` 作为本地缓存或移除）。我可以按小批量替换并验证。
- 添加 2-3 个自动化测试覆盖 AuthContext 注入与 favorites per-user 行为，防止回归。

若需我把收藏彻底切换到 `api.favorites.*`（从前端 localStorage 转为 API-first），请回复“迁移到 API”。