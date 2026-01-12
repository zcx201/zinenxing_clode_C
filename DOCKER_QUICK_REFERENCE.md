# 🚀 快速参考卡 - 工业级 Docker Compose

## 【5分钟快速开始】

```bash
# 1️⃣ 准备环境
cp .env.example .env
# 编辑 .env，填入实际值

# 2️⃣ 启动所有服务
docker-compose -f docker-compose.production.yml --env-file .env up -d

# 3️⃣ 检查状态
docker-compose -f docker-compose.production.yml ps

# 4️⃣ 访问应用
# 前端: http://localhost
# API:  http://localhost:3000/api
# 数据库: localhost:5432 (仅内部)
```

---

## 【核心架构】

```
🎨 前端 ← DNS → 🔧 后端 ← DNS → 🗄️ 数据库
(:80)     内部网络    (:3000)        (:5432)
                  ⬇
                  💾 缓存
                (Redis)
```

**网络隔离**：
- `zhinengxin-internal` : 前端↔后端↔缓存通话
- `zhinengxin-database-private` : 后端↔数据库（隐私）

---

## 【4大深度优化】

### ① 显式网络隔离 ✅
```yaml
networks:
  zhinengxin-internal:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```
**效果**：服务间用 DNS 名称通话（如 `zhinengxin-backend`）

### ② 匿名卷保护依赖 ✅
```yaml
volumes:
  - ./backend:/app              # 挂载代码
  - backend-node-modules:/app/node_modules  # 保护依赖
```
**效果**：本地空目录不覆盖容器内的 npm 包

### ③ 数据库持久化 ✅
```yaml
volumes:
  - zhinengxin-postgres-data:/var/lib/postgresql/data
```
**效果**：`docker-compose down` 后重启，数据保存

### ④ .env 敏感信息 ✅
```yaml
environment:
  DB_PASSWORD: "${DB_PASSWORD}"  # 从 .env 引用
```
**效果**：零明文密码，安全存储

---

## 【常用命令速查】

| 操作 | 命令 |
|------|------|
| **启动** | `docker-compose -f docker-compose.production.yml --env-file .env up -d` |
| **停止** | `docker-compose -f docker-compose.production.yml down` |
| **查看状态** | `docker-compose -f docker-compose.production.yml ps` |
| **查看日志** | `docker-compose -f docker-compose.production.yml logs -f` |
| **进入容器** | `docker exec -it zhinengxin-backend sh` |
| **重启服务** | `docker-compose -f docker-compose.production.yml restart zhinengxin-backend` |
| **清理资源** | `docker-compose -f docker-compose.production.yml down -v` |

---

## 【特定服务日志】

```bash
# 后端日志
docker-compose -f docker-compose.production.yml logs -f zhinengxin-backend

# 前端日志
docker-compose -f docker-compose.production.yml logs -f zhinengxin-frontend

# 数据库日志
docker-compose -f docker-compose.production.yml logs -f zhinengxin-database

# Redis 日志
docker-compose -f docker-compose.production.yml logs -f zhinengxin-cache
```

---

## 【数据库操作】

```bash
# 进入数据库命令行
docker exec -it zhinengxin-database psql -U zhinengxin -d zhinengxin_ai

# 备份
docker exec zhinengxin-database pg_dump -U zhinengxin zhinengxin_ai > backup.sql

# 恢复
docker exec -i zhinengxin-database psql -U zhinengxin zhinengxin_ai < backup.sql
```

---

## 【网络测试】

```bash
# 从后端测试数据库连接
docker exec -it zhinengxin-backend curl http://zhinengxin-database:5432

# 从前端测试后端连接
docker exec -it zhinengxin-frontend curl http://zhinengxin-backend:3000/health

# 进入后端，测试 DNS 解析
docker exec -it zhinengxin-backend nslookup zhinengxin-database
```

---

## 【故障排查】

| 问题 | 解决方案 |
|------|--------|
| **依赖缺失** | `docker-compose down -v` + `docker-compose up` |
| **数据库连接失败** | `docker-compose logs zhinengxin-database` 检查日志 |
| **前后端通信失败** | 检查网络：`docker network inspect zhinengxin_zhinengxin-internal` |
| **端口被占用** | 修改 docker-compose.yml 中的 ports 映射 |
| **磁盘空间不足** | `docker system prune -a` 清理无用资源 |

---

## 【环境变量关键字段】

```bash
# .env 必填项
DB_PASSWORD=YourSecure123!          # 数据库密码
JWT_SECRET=your-secret-key-32chars  # JWT 密钥
REDIS_PASSWORD=RedisSecure123!      # Redis 密码

# API 凭证
JOINQUANT_API_KEY=xxx
JOINQUANT_API_SECRET=xxx
```

---

## 【文件清单】

| 文件 | 作用 |
|------|------|
| `docker-compose.production.yml` | 完整栈配置（前端+后端+DB+Redis） |
| `Dockerfile.production` | 8 阶段镜像构建定义 |
| `.env.example` | 环境变量示例模板 |
| `.env` | 实际敏感信息（⚠️ 不提交 Git） |
| `DOCKER_PRODUCTION_GUIDE.md` | 详细使用文档 |

---

## 【生产部署】

```bash
# 上传到服务器
scp docker-compose.production.yml root@server:/app/
scp .env root@server:/app/

# 远程启动
ssh root@server "cd /app && docker-compose -f docker-compose.production.yml --env-file .env up -d"

# 查看状态
ssh root@server "docker-compose -f docker-compose.production.yml ps"
```

---

## 【资源限制】

| 服务 | CPU | 内存 |
|------|-----|------|
| **后端** | 2 cores | 1GB |
| **前端** | 2 cores | 1GB |
| **数据库** | 1 core | 512MB |
| **Redis** | 0.5 cores | 256MB |

---

## 【健康检查】

所有容器都配置了健康检查，可实时监控：

```bash
# 查看健康状态
docker ps --format "table {{.Names}}\t{{.Status}}"

# 输出示例：
# NAME                      STATUS
# zhinengxin-database       Up 2 minutes (healthy)
# zhinengxin-backend        Up 2 minutes (healthy)
# zhinengxin-frontend       Up 2 minutes (healthy)
# zhinengxin-cache          Up 2 minutes (healthy)
```

---

## 【卷管理】

```bash
# 列出所有卷
docker volume ls | grep zhinengxin

# 检查卷大小
du -sh /var/lib/docker/volumes/zhinengxin-postgres-data/_data

# 删除未使用卷
docker volume prune
```

---

## 【实时监控】

```bash
# 监控资源使用
watch -n 1 docker stats

# 或单次查看
docker stats --no-stream
```

---

## 【关键概念速记】

| 概念 | 说明 |
|------|------|
| **显式网络** | 不用默认桥接，创建专属网络便于隔离和管理 |
| **匿名卷** | 保护容器内关键目录，防止被宿主机覆盖 |
| **命名卷** | 持久化数据，重启不丢失 |
| **DNS 解析** | Docker 内部自动 DNS，服务间用名称访问 |
| **健康检查** | 容器周期性自检，失败自动重启 |
| **多阶段构建** | 减小镜像大小，分离依赖和产物 |

---

## 【危险操作⚠️】

```bash
# ❌ 删除所有卷（会丢失数据！）
docker-compose down -v

# ✅ 安全停止（保留数据）
docker-compose down

# ❌ 强制删除数据库卷
docker volume rm zhinengxin-postgres-data

# ✅ 备份再删除
docker exec zhinengxin-database pg_dump -U zhinengxin zhinengxin_ai > backup.sql
docker volume rm zhinengxin-postgres-data
```

---

## 【性能优化】

```bash
# 使用 BuildKit 加快构建
export DOCKER_BUILDKIT=1
docker build -t zhinengxin-ai:backend --target backend .

# 检查镜像大小
docker images | grep zhinengxin

# 清理悬挂镜像
docker image prune
```

---

## 【Dockerfile 选择】

```bash
# 生产前端镜像
docker build -t zhinengxin-ai:frontend --target frontend -f Dockerfile.production .

# 后端镜像
docker build -t zhinengxin-ai:backend --target backend -f Dockerfile.production .

# 开发前端（带热更新）
docker build -t zhinengxin-ai:frontend-dev --target frontend-dev -f Dockerfile.production .
```

---

## 【调试技巧】

```bash
# 进入容器调试
docker exec -it zhinengxin-backend sh

# 查看环境变量
docker exec zhinengxin-backend env | grep DB_

# 运行临时命令
docker exec zhinengxin-backend npm list express

# 查看容器 IP
docker inspect --format='{{.NetworkSettings.IPAddress}}' zhinengxin-backend
```

---

## 【推荐阅读顺序】

1. 这个文件（快速上手）- 5 分钟
2. `DOCKER_PRODUCTION_GUIDE.md`（详细指南）- 30 分钟
3. `docker-compose.production.yml`（配置细节）- 20 分钟
4. `Dockerfile.production`（镜像构建）- 15 分钟

---

## 【快速链接】

| 资源 | 地址 |
|------|------|
| Docker 官文 | https://docs.docker.com/ |
| Compose 文档 | https://docs.docker.com/compose/ |
| PostgreSQL 文档 | https://www.postgresql.org/docs/ |
| Redis 文档 | https://redis.io/documentation |

---

**最后更新**: 2026-01-12  
**版本**: 1.0.0  
**难度**: ⭐⭐ 中等

需要帮助？检查 `DOCKER_PRODUCTION_GUIDE.md` 的"故障排查"章节！
