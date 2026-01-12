# 🐳 工业级 Docker Compose 使用指南
## 智能鑫AI - 前端/后端/数据库完整栈

---

## 📋 目录

1. [快速开始](#快速开始)
2. [架构说明](#架构说明)
3. [4大深度优化原则](#4大深度优化原则)
4. [常用命令](#常用命令)
5. [故障排查](#故障排查)
6. [生产部署](#生产部署)

---

## 🚀 快速开始

### 【第1步】准备环境文件

```bash
# 复制示例配置
cp .env.example .env

# 编辑 .env，填入实际值
vi .env
```

**必须填写的字段**：
- `DB_PASSWORD` - 数据库密码
- `JWT_SECRET` - JWT 密钥（至少 32 字符）
- `REDIS_PASSWORD` - Redis 密码
- `JOINQUANT_API_KEY` - 聚宽 API 密钥
- `JOINQUANT_API_SECRET` - 聚宽 API 密钥

### 【第2步】启动完整栈

```bash
# 一键启动所有服务（前端 + 后端 + 数据库 + Redis）
docker-compose -f docker-compose.production.yml --env-file .env up -d

# 等待 30 秒，让所有服务启动...

# 查看启动日志
docker-compose -f docker-compose.production.yml logs -f
```

### 【第3步】验证服务

```bash
# 查看运行中的容器
docker-compose -f docker-compose.production.yml ps

# 输出应显示：
# NAME                    STATUS
# zhinengxin-database     Up (healthy)
# zhinengxin-backend      Up (healthy)
# zhinengxin-frontend     Up (healthy)
# zhinengxin-cache        Up (healthy)
```

### 【第4步】访问应用

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 Web | http://localhost | 用户界面 |
| 后端 API | http://localhost:3000/api | REST API 端点 |
| 数据库 | localhost:5432 | PostgreSQL（仅内部） |
| Redis | localhost:6379 | 缓存（仅内部） |

---

## 🏗️ 架构说明

### 服务拓扑图

```
┌─────────────────────────────────────────────────────┐
│         zhinengxin-internal (桥接网络)              │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │   Frontend     Backend      Cache           │   │
│  │   (Node.js)    (Node.js)    (Redis)         │   │
│  │   :3001        :3000        :6379           │   │
│  │                  ↓                          │   │
│  │      Connected via DNS names                │   │
│  │   - zhinengxin-frontend                     │   │
│  │   - zhinengxin-backend                      │   │
│  │   - zhinengxin-cache                        │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                      ↓                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  zhinengxin-database-private (数据库隐私)   │   │
│  │                                             │   │
│  │   Database (PostgreSQL) :5432               │   │
│  │   (仅后端可访问)                            │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

∨ 对外接口 ∨
┌────────┬────────┬──────────┐
│  :80   │ :3000  │ :6379*   │
│ 前端   │ API    │ Redis*   │
│        │        │(*仅本机) │
└────────┴────────┴──────────┘
```

### 数据流向

```
用户浏览器
    ↓ 访问 :80
前端 (Node.js + Vite)
    ↓ API 调用 (http://zhinengxin-backend:3000/api)
后端 (Node.js)
    ├─ 缓存查询 (redis://zhinengxin-cache:6379)
    │       ↓ 缓存未中
    └─ 数据查询 (postgresql://zhinengxin-database:5432)
```

---

## 💎 4大深度优化原则

### 原则1️⃣ - 显式网络隔离

**配置文件**：`docker-compose.production.yml` 第 11-31 行

```yaml
networks:
  zhinengxin-internal:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
  
  zhinengxin-database-private:
    driver: bridge
    ipam:
      config:
        - subnet: 172.21.0.0/16
```

**效果**：
- ✅ **内部通话**：服务间可用 DNS 名称（`zhinengxin-backend`）而非 IP
- ✅ **网络隔离**：数据库仅后端可访问，前端无法直接连接
- ✅ **安全性**：外部流量无法直接访问内部服务

**验证方法**：
```bash
# 进入后端容器
docker exec -it zhinengxin-backend sh

# 测试内部 DNS 解析
nslookup zhinengxin-database
# 应该返回 172.21.x.x

# 测试数据库连接
psql -h zhinengxin-database -U zhinengxin -d zhinengxin_ai
```

---

### 原则2️⃣ - 匿名卷保护依赖

**配置文件**：`docker-compose.production.yml` 后端和前端的 `volumes` 部分

**后端示例**：
```yaml
volumes:
  # ✅ 挂载源代码
  - ./backend:/app
  
  # 【核心】匿名卷保护 node_modules
  - zhinengxin-backend-node-modules:/app/node_modules
```

**为什么需要**：

```
问题场景：
  本地目录结构         容器构建过程              挂载后
  ./backend/           npm install 在容器内      ./backend/
    package.json  →    生成 node_modules   →    package.json
    src/               1000+个文件              src/
    (无node_modules)   占 200+ MB               node_modules/ ❌ 被覆盖！

解决方案：
  卷挂载顺序：
  1. ./backend → /app            (挂载所有文件)
  2. 匿名卷 → /app/node_modules  (保护依赖目录)
  
  结果：
  /app/
    ├─ package.json              ✓ 来自本地
    ├─ src/                       ✓ 来自本地
    └─ node_modules/              ✓ 来自容器内安装（受保护）
```

**验证方法**：
```bash
# 进入后端容器
docker exec -it zhinengxin-backend sh

# 查看 node_modules 源
mount | grep node_modules
# 应该显示：
# /dev/mapper/vg-xxx on /app/node_modules type ext4 (rw,relatime)

# 本地列出 node_modules（应该为空或很小）
ls -la ./backend/node_modules
# 大部分内容不在本地

# 容器内列出 node_modules（应该完整）
ls -la /app/node_modules | head -20
# 显示完整的 npm 包列表
```

---

### 原则3️⃣ - 数据库持久化

**配置文件**：`docker-compose.production.yml` 第 47-51 行和 `volumes` 第 450+ 行

```yaml
services:
  zhinengxin-database:
    volumes:
      # 【关键】数据卷挂载
      - zhinengxin-postgres-data:/var/lib/postgresql/data

volumes:
  zhinengxin-postgres-data:
    driver: local  # 或指定本地路径
```

**效果**：
- ✅ **数据永久保存**：`docker-compose down` 后重新启动，数据依然存在
- ✅ **灾难恢复**：可备份 `docker volume ls` 中的卷
- ✅ **多实例安全**：不同容器可共享同一数据库卷

**验证方法**：
```bash
# 1. 查看已创建的卷
docker volume ls | grep zhinengxin

# 输出：
# zhinengxin-postgres-data
# zhinengxin-backend-node-modules
# zhinengxin-frontend-node-modules

# 2. 检查卷详情
docker volume inspect zhinengxin-postgres-data

# 输出会显示：
# "Mountpoint": "/var/lib/docker/volumes/zhinengxin-postgres-data/_data"

# 3. 插入测试数据
docker exec -it zhinengxin-database psql -U zhinengxin -d zhinengxin_ai -c "CREATE TABLE test(id INT); INSERT INTO test VALUES(1);"

# 4. 停止容器
docker-compose -f docker-compose.production.yml down

# 5. 重新启动
docker-compose -f docker-compose.production.yml up -d

# 6. 验证数据存在
docker exec -it zhinengxin-database psql -U zhinengxin -d zhinengxin_ai -c "SELECT * FROM test;"
# 应该返回 id=1

# 7. 清理测试数据
docker exec -it zhinengxin-database psql -U zhinengxin -d zhinengxin_ai -c "DROP TABLE test;"
```

---

### 原则4️⃣ - .env 敏感信息管理

**配置文件**：`.env.example` 和 `docker-compose.production.yml`

**零明文密码示例**：

```yaml
# ❌ 错误（不要这样做）
environment:
  DB_PASSWORD: MySecretPassword123

# ✅ 正确（使用 .env 引用）
environment:
  DB_PASSWORD: "${DB_PASSWORD}"
```

**使用流程**：

```bash
# 1. 复制示例文件
cp .env.example .env

# 2. 编辑 .env（不要提交到 Git）
cat > .env << EOF
DB_PASSWORD=MySecurePassword123!@#
JWT_SECRET=your-super-secret-key-at-least-32-chars
REDIS_PASSWORD=RedisSecure123!
JOINQUANT_API_KEY=actual-key
JOINQUANT_API_SECRET=actual-secret
EOF

# 3. 添加到 .gitignore
echo ".env" >> .gitignore
echo ".env.*.local" >> .gitignore

# 4. Docker Compose 自动加载
docker-compose -f docker-compose.production.yml up

# 5. 验证变量传递
docker exec -it zhinengxin-backend sh -c 'echo $DB_PASSWORD'
# 应该显示实际密码（已从 .env 注入）
```

**最佳实践**：

```bash
# 生成安全密码（Linux/Mac）
openssl rand -base64 32

# PowerShell 生成
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
```

---

## 📚 常用命令

### 启动和停止

```bash
# 启动所有服务
docker-compose -f docker-compose.production.yml --env-file .env up -d

# 停止所有服务（保留数据）
docker-compose -f docker-compose.production.yml stop

# 启动已停止的服务
docker-compose -f docker-compose.production.yml start

# 重启所有服务
docker-compose -f docker-compose.production.yml restart

# 停止并删除容器（保留卷）
docker-compose -f docker-compose.production.yml down

# 完全清理（删除容器和卷！！）
docker-compose -f docker-compose.production.yml down -v
```

### 日志和调试

```bash
# 查看所有服务日志
docker-compose -f docker-compose.production.yml logs

# 实时跟踪特定服务日志
docker-compose -f docker-compose.production.yml logs -f zhinengxin-backend

# 显示最后 100 行
docker-compose -f docker-compose.production.yml logs --tail=100 zhinengxin-database

# 进入容器 shell
docker exec -it zhinengxin-backend sh

# 执行单次命令
docker exec -it zhinengxin-backend npm list

# 查看容器资源使用
docker stats zhinengxin-backend

# 查看容器网络
docker network inspect zhinengxin_zhinengxin-internal
```

### 数据库操作

```bash
# 进入数据库命令行
docker exec -it zhinengxin-database psql -U zhinengxin -d zhinengxin_ai

# 常见数据库命令
psql> \dt                    # 列出所有表
psql> \dg                    # 列出所有用户
psql> SELECT * FROM users;   # 查询示例
psql> \q                     # 退出

# 备份数据库
docker exec -it zhinengxin-database pg_dump -U zhinengxin zhinengxin_ai > backup.sql

# 恢复数据库
docker exec -i zhinengxin-database psql -U zhinengxin zhinengxin_ai < backup.sql
```

### 卷管理

```bash
# 列出所有卷
docker volume ls | grep zhinengxin

# 检查卷详情
docker volume inspect zhinengxin-postgres-data

# 清理未使用的卷
docker volume prune

# 删除特定卷
docker volume rm zhinengxin-postgres-data
```

---

## 🔧 故障排查

### 问题1：依赖缺失，容器启动失败

**症状**：
```
Error: Cannot find module 'express'
```

**原因**：匿名卷配置错误，`node_modules` 被覆盖

**解决**：
```bash
# 1. 检查卷配置
docker volume ls | grep node_modules

# 2. 删除容器和卷
docker-compose -f docker-compose.production.yml down -v

# 3. 重新构建
docker-compose -f docker-compose.production.yml build --no-cache

# 4. 启动
docker-compose -f docker-compose.production.yml up -d
```

---

### 问题2：数据库无法连接

**症状**：
```
connection refused to 127.0.0.1:5432
```

**原因**：
- 数据库服务未启动
- 网络配置错误
- 认证失败

**解决**：
```bash
# 1. 检查容器状态
docker-compose -f docker-compose.production.yml ps

# 2. 查看数据库日志
docker-compose -f docker-compose.production.yml logs zhinengxin-database

# 3. 健康检查
docker ps --format "table {{.Names}}\t{{.Status}}"

# 4. 测试网络连接（进入后端）
docker exec -it zhinengxin-backend curl http://zhinengxin-database:5432

# 5. 使用完整 URL 连接
docker exec -it zhinengxin-database psql "postgresql://zhinengxin:${DB_PASSWORD}@localhost:5432/zhinengxin_ai"
```

---

### 问题3：前后端通信失败

**症状**：
```
Failed to fetch from http://localhost:3000/api
```

**原因**：
- 后端未运行
- 前端配置的 API URL 错误
- 网络隔离问题

**解决**：
```bash
# 1. 验证前端配置
docker exec -it zhinengxin-frontend env | grep VITE_API

# 应该显示：
# VITE_API_BASE_URL=http://zhinengxin-backend:3000/api

# 2. 测试后端可达性（从前端）
docker exec -it zhinengxin-frontend curl http://zhinengxin-backend:3000/health

# 3. 检查防火墙
sudo iptables -L DOCKER-USER

# 4. 查看网络配置
docker network inspect zhinengxin_zhinengxin-internal

# 应该看到后端和前端都连接到此网络
```

---

### 问题4：磁盘空间不足

**症状**：
```
No space left on device
```

**解决**：
```bash
# 1. 检查卷大小
docker volume ls
docker volume inspect zhinengxin-postgres-data

# 2. 查看 Docker 磁盘使用
docker system df

# 3. 清理未使用资源
docker system prune -a

# 4. 查看卷实际大小
du -sh /var/lib/docker/volumes/zhinengxin-postgres-data/_data

# 5. 如果数据库太大，考虑迁移卷
# 这是高级操作，需要备份和恢复
```

---

### 问题5：内存溢出（Out of Memory）

**症状**：
```
OutOfMemory: JavaScript heap out of memory
```

**解决**：
```bash
# 1. 查看内存使用
docker stats zhinengxin-backend

# 2. 增加内存限制（docker-compose.production.yml）
services:
  zhinengxin-backend:
    deploy:
      resources:
        limits:
          memory: 2G  # 从 1G 增加到 2G

# 3. 重启容器
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

---

## 🚢 生产部署

### 部署到远程服务器

```bash
# 1. 将文件上传到服务器
scp docker-compose.production.yml root@your-server:/app/
scp .env root@your-server:/app/
scp Dockerfile root@your-server:/app/

# 2. SSH 登录服务器
ssh root@your-server

# 3. 安装 Docker（如果未安装）
curl -fsSL https://get.docker.com | sh

# 4. 启动服务
cd /app
docker-compose -f docker-compose.production.yml --env-file .env up -d

# 5. 验证
docker-compose -f docker-compose.production.yml ps
```

### 备份策略

```bash
# 每日自动备份（加入 crontab）
0 2 * * * docker exec zhinengxin-database pg_dump -U zhinengxin zhinengxin_ai | gzip > /backup/zhinengxin-$(date +\%Y\%m\%d).sql.gz

# 手动备份
docker exec -it zhinengxin-database pg_dump -U zhinengxin zhinengxin_ai > backup.sql

# 恢复
docker exec -i zhinengxin-database psql -U zhinengxin zhinengxin_ai < backup.sql
```

### 监控和告警

```bash
# 实时监控资源
watch -n 1 docker stats

# 查看启动时间
docker inspect --format='{{.State.StartedAt}}' zhinengxin-backend

# 查看最后错误
docker logs zhinengxin-backend 2>&1 | tail -50
```

---

## 📚 文件清单

| 文件 | 用途 |
|------|------|
| `docker-compose.production.yml` | 生产配置（前端+后端+数据库+Redis） |
| `.env.example` | 环境变量示例 |
| `.env` | 实际环境变量（不提交 Git） |
| `Dockerfile` | 镜像构建定义 |

---

## 🎯 快速速查表

| 操作 | 命令 |
|------|------|
| 启动所有 | `docker-compose -f docker-compose.production.yml --env-file .env up -d` |
| 停止所有 | `docker-compose -f docker-compose.production.yml down` |
| 查看日志 | `docker-compose -f docker-compose.production.yml logs -f` |
| 重启服务 | `docker-compose -f docker-compose.production.yml restart zhinengxin-backend` |
| 进入容器 | `docker exec -it zhinengxin-backend sh` |
| 数据库备份 | `docker exec zhinengxin-database pg_dump -U zhinengxin zhinengxin_ai > backup.sql` |

---

## 📞 获取帮助

- 查看日志：`docker-compose -f docker-compose.production.yml logs zhinengxin-backend`
- Docker 官文：https://docs.docker.com/compose/
- PostgreSQL 文档：https://www.postgresql.org/docs/

---

**最后更新**: 2026-01-12
**版本**: 1.0.0
**维护者**: Docker Architect Team
