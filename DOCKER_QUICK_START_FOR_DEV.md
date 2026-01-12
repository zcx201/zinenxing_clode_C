# ⚡ Docker 开发环境 - 一键启动指南

**只需3个步骤，1分钟启动！**

---

## 🚀 第1步：打开 PowerShell

```powershell
# Windows 用户：
# 1. 按 Win + X
# 2. 选择 "Windows PowerShell" 或 "PowerShell"
# 3. 或在开始菜单搜索 "powershell"
```

---

## 📂 第2步：进入项目目录

```powershell
cd "e:\ZL\AI\20251024jinjiao\clode\zinenxing\zinenxing_clode_C"
```

---

## ▶️ 第3步：运行启动脚本

```powershell
.\start-dev.ps1
```

**就这样！** 脚本会自动：
- ✅ 检查Docker是否安装
- ✅ 验证配置文件
- ✅ 构建镜像（2-3分钟）
- ✅ 启动容器
- ✅ 打开浏览器到 http://localhost:5173

---

## 💡 关键信息

### 脚本执行时间
- **快速启动**：1-2分钟（如果镜像已缓存）
- **完整构建**：3-5分钟（首次运行）
- **等待就绪**：10-30秒（Vite启动）

### 预期输出

```
[SUCCESS] ✅ 开发环境启动成功！
==================================
访问地址：
  🌐 前端应用:  http://localhost:5173
```

### 浏览器会自动打开
如果没有自动打开，手动访问：**http://localhost:5173**

---

## 🎯 开发工作流

### 编写代码
1. 在 `src/` 目录修改文件
2. **保存文件**
3. 浏览器自动刷新（热更新）
4. 看到你的代码效果 ✨

### 查看日志
```powershell
# 新开一个 PowerShell 窗口
.\view-logs.ps1
```

### 停止开发
```powershell
# 新开一个 PowerShell 窗口
.\stop-dev.ps1
```

---

## ❓ 遇到问题？

### 脚本无法运行
```powershell
# 复制粘贴这个命令
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# 按 Y 确认
# 再运行 .\start-dev.ps1
```

### Docker未安装
1. 下载：https://www.docker.com/products/docker-desktop
2. 安装并重启电脑
3. 重新运行脚本

### 快速诊断
```powershell
.\diagnose.ps1
```
生成诊断报告，查看 `docker-diagnose.txt`

### 更多问题
查看：**DOCKER_QUICK_FIX.md** 或 **DOCKER_DEV_TROUBLESHOOTING.md**

---

## 📚 进一步了解

| 我想... | 查看这个文件 | 耗时 |
|--------|-----------|------|
| 快速参考 | DOCKER_QUICK_REFERENCE.md | 5分钟 |
| 快速修复 | DOCKER_QUICK_FIX.md | 10分钟 |
| 优化原理 | DOCKER_DEV_OPTIMIZATION_SUMMARY.md | 30分钟 |
| 故障排查 | DOCKER_DEV_TROUBLESHOOTING.md | 需要时查 |
| 完整教程 | DOCKER_PRODUCTION_GUIDE.md | 1小时 |

---

## ✨ 就这么简单！

```powershell
# 三行命令，一键启动
cd "e:\ZL\AI\20251024jinjiao\clode\zinenxing\zinenxing_clode_C"
.\start-dev.ps1
# 等待浏览器自动打开...
```

**开始开发吧！** 🚀

---

**最后更新**：2026年1月12日  
**难度等级**：⭐ 非常简单  
**初心者友好**：✅ 完全友好
