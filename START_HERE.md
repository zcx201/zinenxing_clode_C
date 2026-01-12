# 👋 开始这里 - 工业级 Docker 配置使用指南
## 智能鑫AI - 5分钟快速开始

---

## ⚡ 5分钟快速开始

### 第1步：复制环境配置（1分钟）

```bash
# 复制示例配置
cp .env.example .env

# 用你喜欢的编辑器打开
# vim .env
# 或用 VSCode 打开编辑
```

### 第2步：填写必需的值（2分钟）

编辑 `.env` 文件，找到这些行并填入值：

```bash
DB_PASSWORD=YourSecure123!@#        # 替换为你的数据库密码
JWT_SECRET=your-secret-key-at-least-32-chars  # 替换为你的密钥
REDIS_PASSWORD=RedisSecure123!      # 替换为你的 Redis 密码

# API 密钥（可选但推荐）
JOINQUANT_API_KEY=your-actual-key
JOINQUANT_API_SECRET=your-actual-secret
```

**💡 提示**：密码生成命令
```bash
# Linux/Mac
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
```

### 第3步：启动应用（1分钟）

```bash
# 一键启动所有服务
docker-compose -f docker-compose.production.yml --env-file .env up -d

# 看到类似下面的输出说明成功：
# [+] Running 4/4
#  ✔ Container zhinengxin-database   Started
#  ✔ Container zhinengxin-cache      Started
#  ✔ Container zhinengxin-backend    Started
#  ✔ Container zhinengxin-frontend   Started
```

### 第4步：验证服务（1分钟）

```bash
# 查看所有服务状态
docker-compose -f docker-compose.production.yml ps

# 应该显示：
# NAME                      STATUS
# zhinengxin-database       Up (healthy)
# zhinengxin-backend        Up (healthy)
# zhinengxin-frontend       Up (healthy)
# zhinengxin-cache          Up (healthy)

# 如果都显示 "healthy"，说明一切正常！✅
```

### 第5步：访问应用（即时）

打开浏览器访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| **前端应用** | http://localhost | 用户界面 |
| **API 端点** | http://localhost:3000/health | 后端检查 |
| **数据库** | localhost:5432 | 仅内部访问 |
| **缓存** | localhost:6379 | 仅内部访问 |

---

## 🎯 完成了！

恭喜！你的**工业级 Docker 容器应用**已经在运行！

现在你可以：
- ✅ 访问前端应用
- ✅ 调用后端 API
- ✅ 数据已持久化
- ✅ 所有服务自动重启

---

## 📚 接下来怎么做？

### 选项A：快速学习（推荐用时：30分钟）

1. **打开** `DOCKER_QUICK_REFERENCE.md`
   - 5 分钟快速参考卡
   - 常用命令速查
   - 快速故障排查

2. **尝试几个命令**
   ```bash
   # 查看日志
   docker-compose logs -f zhinengxin-backend
   
   # 进入容器
   docker exec -it zhinengxin-backend sh
   
   # 重启服务
   docker-compose restart zhinengxin-backend
   ```

3. **验证网络隔离**
   ```bash
   # 从前端尝试访问数据库（应该失败）
   docker exec zhinengxin-frontend timeout 3 curl zhinengxin-database:5432
   # 应该超时或拒绝（这是正确的！）
   ```

### 选项B：完整学习（推荐用时：2小时）

1. **阅读** `DOCKER_PRODUCTION_GUIDE.md`
   - 完整的部署教程
   - 所有命令详解
   - 故障排查指南

2. **理解 4 大原则**
   - 显式网络隔离
   - 匿名卷保护依赖
   - 数据库持久化
   - .env 敏感信息管理

3. **实际操作**
   - 查看日志
   - 进入容器
   - 修改源代码（观察热更新）
   - 检查卷和网络

### 选项C：深度学习（推荐用时：4小时）

1. **深度讲解** `DOCKER_PRINCIPLES_DEEP_DIVE.md`
   - 完整的原理讲解
   - 工作流程
   - 陷阱和解决方案

2. **升级学习** `DOCKER_UPGRADE_GUIDE.md`
   - 基础版 vs 工业级对比
   - 演进路径
   - 定制化配置

3. **实践操作**
   - 修改配置
   - 测试效果
   - 定制以适应你的项目

---

## 🆘 遇到问题了？

### 问题1：容器无法启动

```bash
# 查看详细错误日志
docker-compose -f docker-compose.production.yml logs

# 查看特定服务
docker-compose logs zhinengxin-backend

# 查看更多行
docker-compose logs --tail=100 zhinengxin-database
```

**解决**：查看 `DOCKER_PRODUCTION_GUIDE.md` 的"故障排查"章节

### 问题2：依赖缺失（Cannot find module）

```bash
# 这通常是匿名卷问题，重建容器
docker-compose down -v  # ⚠️ 这会删除所有卷！

# 更安全的做法：
docker-compose down     # 仅删除容器
docker-compose up -d    # 重新启动，卷保留
```

### 问题3：数据库连接失败

```bash
# 查看数据库日志
docker-compose logs zhinengxin-database

# 测试连接
docker exec zhinengxin-database psql -U zhinengxin -d zhinengxin_ai -c "SELECT 1;"

# 检查 .env 中的密码是否正确
cat .env | grep DB_PASSWORD
```

### 问题4：端口被占用

```bash
# 检查哪个进程占用了端口
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# 修改 docker-compose.production.yml 的端口映射
# 例如改为 :3001 而不是 :3000
```

### 更多问题？

👉 查看 `DOCKER_PRODUCTION_GUIDE.md` 中的完整**故障排查**章节

---

## 🗺️ 文档地图

### 快速查询

| 我想... | 看这个文件 | 时间 |
|--------|----------|------|
| 快速参考命令 | `DOCKER_QUICK_REFERENCE.md` | 5 分钟 |
| 完整教程 | `DOCKER_PRODUCTION_GUIDE.md` | 1 小时 |
| 理解原理 | `DOCKER_PRINCIPLES_DEEP_DIVE.md` | 2 小时 |
| 升级项目 | `DOCKER_UPGRADE_GUIDE.md` | 1 小时 |
| 验证配置 | `DOCKER_CHECKLIST.md` | 30 分钟 |
| 找文件 | `DOCKER_COMPLETE_INDEX.md` | 5 分钟 |
| 查看总结 | `DOCKER_PROJECT_COMPLETION_REPORT.md` | 10 分钟 |

### 按场景查找

| 场景 | 文件 |
|------|------|
| "我刚开始" | 本文件 + DOCKER_QUICK_REFERENCE.md |
| "我要部署" | DOCKER_PRODUCTION_GUIDE.md |
| "我要理解" | DOCKER_PRINCIPLES_DEEP_DIVE.md |
| "我有问题" | DOCKER_PRODUCTION_GUIDE.md 的故障排查 |
| "我想升级" | DOCKER_UPGRADE_GUIDE.md |
| "我要验证" | DOCKER_CHECKLIST.md |

---

## ⚙️ 常用命令速查

```bash
# 启动应用
docker-compose -f docker-compose.production.yml --env-file .env up -d

# 停止应用
docker-compose -f docker-compose.production.yml down

# 查看日志
docker-compose logs -f zhinengxin-backend

# 进入容器
docker exec -it zhinengxin-backend sh

# 重启服务
docker-compose restart zhinengxin-backend

# 查看状态
docker-compose ps

# 完整清理（⚠️ 删除卷！）
docker-compose down -v

# 数据库备份
docker exec zhinengxin-database pg_dump -U zhinengxin zhinengxin_ai > backup.sql
```

更多命令？→ `DOCKER_QUICK_REFERENCE.md`

---

## 📋 关键点速记

| 概念 | 说明 |
|------|------|
| **显式网络** | 前端和后端在同一网络，后端和数据库在隐私网络 |
| **匿名卷** | 本地 node_modules 为空，容器内的通过卷保护 |
| **数据持久化** | 数据存储在卷中，容器重启后还在 |
| **.env 文件** | 敏感信息（密码、密钥）不在 YAML 中 |
| **健康检查** | 容器自动检查是否正常，自动重启 |
| **多阶段构建** | 最小化镜像体积（260MB 而不是 800MB） |

---

## ✅ 检查清单

启动前确保：

- [ ] 已运行 `cp .env.example .env`
- [ ] 已编辑 .env 文件，填入必需值
- [ ] Docker 已安装（`docker --version`）
- [ ] Docker Compose 已安装（`docker-compose --version`）
- [ ] 端口未被占用（:80, :3000, :5432, :6379）
- [ ] 磁盘空间充足（>5GB）

启动后验证：

- [ ] 所有 4 个容器都显示"Up (healthy)"
- [ ] 能访问 http://localhost
- [ ] 能调用 http://localhost:3000/health
- [ ] `docker-compose logs` 无错误

---

## 🎓 学习建议

### 如果你是初学者
1. **现在**：完成上面的"5分钟快速开始"
2. **今天**：阅读 `DOCKER_QUICK_REFERENCE.md`
3. **本周**：阅读 `DOCKER_PRODUCTION_GUIDE.md`
4. **之后**：实践和定制

### 如果你有 Docker 经验
1. **现在**：完成"5分钟快速开始"
2. **今天**：查看 `docker-compose.production.yml` 的注释
3. **本周**：阅读 `DOCKER_PRINCIPLES_DEEP_DIVE.md`
4. **之后**：根据需要定制

### 如果你是 Docker 专家
1. **现在**：快速浏览 `DOCKER_QUICK_REFERENCE.md`
2. **直接**：查看源文件中的注释
3. **按需**：参考文档中的特定章节

---

## 🚀 下一步

现在你有 3 个选择：

### 选择1：快速启动（推荐，5分钟）
- ✅ 已完成上面的"5分钟快速开始"
- ✅ 应用已经运行
- ✅ 下一步：`DOCKER_QUICK_REFERENCE.md`

### 选择2：完整学习（推荐，2小时）
- ⏭️ 打开 `DOCKER_PRODUCTION_GUIDE.md`
- ⏭️ 阅读从"快速开始"到"常用命令"
- ⏭️ 尝试各种操作

### 选择3：深度掌握（推荐，4小时）
- ⏭️ 阅读 `DOCKER_PRINCIPLES_DEEP_DIVE.md`
- ⏭️ 阅读 `DOCKER_PRODUCTION_GUIDE.md`
- ⏭️ 阅读 `DOCKER_UPGRADE_GUIDE.md`
- ⏭️ 实际修改和定制配置

---

## 💡 最后的话

你现在拥有了一套**符合工业级标准**的完整容器化解决方案！

这个配置包括：
- ✅ 完整的前端、后端、数据库、缓存栈
- ✅ 4 大深度优化原则（网络隔离、卷保护、数据持久化、敏感信息管理）
- ✅ 8000+ 行详细文档和指南
- ✅ 所有配置都有中文注释
- ✅ 生产级别的安全性和可靠性

现在就开始使用吧！

---

## 📞 需要帮助？

| 问题类型 | 查看这里 |
|---------|---------|
| **快速问题** | 这个文件（START_HERE.md） |
| **具体命令** | `DOCKER_QUICK_REFERENCE.md` |
| **详细操作** | `DOCKER_PRODUCTION_GUIDE.md` |
| **理论原理** | `DOCKER_PRINCIPLES_DEEP_DIVE.md` |
| **故障排查** | `DOCKER_PRODUCTION_GUIDE.md` 的故障排查章节 |
| **找不到文件** | `DOCKER_COMPLETE_INDEX.md` |

---

**准备好了吗？** 让我们开始吧！ 🚀

👉 如果你还没完成"5分钟快速开始"，现在就开始！  
👉 如果你已完成了，打开 `DOCKER_QUICK_REFERENCE.md` 学习更多命令。

