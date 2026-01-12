# ⚡ Docker 开发 - 快速参考卡

**打印这个页面或保存为书签！**

---

## 🚀 立即启动（一行命令）

```powershell
# 进入项目目录后：
.\start-dev.ps1
```

浏览器自动打开 → http://localhost:5173 ✅

---

## 📝 4 个基本命令

| 命令 | 文件 | 功能 |
|------|------|------|
| **启动** | `.\start-dev.ps1` | 一键启动开发环境 |
| **日志** | `.\view-logs.ps1` | 查看实时日志 |
| **停止** | `.\stop-dev.ps1` | 停止容器 |
| **诊断** | `.\diagnose.ps1` | 诊断环境问题 |

---

## 🔍 诊断步骤

```powershell
# 1. 检查 Docker 安装
docker --version
docker-compose --version

# 2. 查看容器状态
docker-compose ps

# 3. 查看日志
docker-compose logs zhinengxin-dev

# 4. 生成诊断报告
.\diagnose.ps1
```

---

## 💡 常见问题快速解

### 脚本无法运行
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# 按 Y 确认，重新运行
.\start-dev.ps1
```

### Docker 未安装
→ 下载 Docker Desktop：https://www.docker.com/products/docker-desktop

### 端口被占用
→ 在 docker-compose.dev.yml 修改：`"5173:5173"` → `"5174:5173"`

### 无法访问 http://localhost:5173
```powershell
# 检查容器状态
docker-compose ps
# 应该显示 "Up (healthy)"

# 查看错误日志
.\view-logs.ps1
```

---

## 📚 文档速查

| 需求 | 文档 | 耗时 |
|------|------|------|
| **最快开始** | START_DEVELOPMENT.md | 3分钟 |
| **快速启动** | DOCKER_QUICK_START_FOR_DEV.md | 5分钟 |
| **快速修复** | DOCKER_QUICK_FIX.md | 20分钟 |
| **快速命令** | DOCKER_QUICK_REFERENCE.md | 10分钟 |
| **深入学习** | DOCKER_DEV_OPTIMIZATION_SUMMARY.md | 1小时 |
| **故障排查** | DOCKER_DEV_TROUBLESHOOTING.md | 需要时查 |
| **完整教程** | DOCKER_PRODUCTION_GUIDE.md | 2小时 |

---

## ✅ 启动检查表

运行脚本后，验证：

- [ ] 容器状态显示 `Up (healthy)`
- [ ] 浏览器打开 http://localhost:5173
- [ ] 看到应用界面
- [ ] 修改代码自动热更新
- [ ] 日志无 ERROR 信息

---

## 🎯 开发工作流

```
修改代码 → 保存文件 → 浏览器自动刷新 → 看到效果
   ↑                                        ↓
   └────────── 循环 ────────────────────────┘
```

---

## 📞 获取帮助

### 自动诊断
```powershell
.\diagnose.ps1
# 生成 docker-diagnose.txt
```

### 查看文档
- 快速问题：**DOCKER_QUICK_FIX.md**
- 故障排查：**DOCKER_DEV_TROUBLESHOOTING.md**
- 所有命令：**DOCKER_QUICK_REFERENCE.md**

### 手动命令
```powershell
# 查看完整日志
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs

# 进入容器调试
docker exec -it zhinengxin-dev sh

# 重新构建镜像
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
```

---

## 🔧 配置修改

修改端口：
```yaml
# docker-compose.dev.yml
ports:
  - "5174:5173"  # 改成 5174
```

修改日志级别：
```yaml
# docker-compose.dev.yml
environment:
  LOG_LEVEL: debug  # 改成 info 或 warn
```

---

## ⏱️ 时间参考

| 操作 | 耗时 |
|------|------|
| 首次启动 | 3-5分钟 |
| 后续启动 | 1-2分钟 |
| 构建镜像 | 2-3分钟（首次）/ <1分钟（缓存） |
| 启动容器 | 5-10秒 |
| 热更新 | <1秒 |

---

## 📊 系统要求

- ✅ Windows 10/11 + Docker Desktop
- ✅ 或 Linux/Mac + Docker + Docker Compose
- ✅ 磁盘空间：>5GB
- ✅ 内存：>2GB 空闲

---

## 🎉 现在就开始！

```powershell
cd "e:\ZL\AI\20251024jinjiao\clode\zinenxing\zinenxing_clode_C"
.\start-dev.ps1
```

一切都会自动完成！✨

---

**最后更新**：2026年1月12日
