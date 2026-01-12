# Docker 部署指南 - 智能鑫AI

本指南详细说明如何使用Dockerfile和Docker Compose部署智能鑫AI系统。

---

## 📋 文件说明

| 文件 | 用途 | 说明 |
|------|------|------|
| `Dockerfile` | 主构建文件 | 多阶段构建，支持Prod和Dev两个target |
| `.dockerignore` | 构建忽略列表 | 排除不必要的文件，优化镜像体积 |
| `docker-compose.yml` | 基础配置 | 定义Prod和Dev两个服务 |
| `docker-compose.dev.yml` | 开发配置 | 开发环境特定配置（热挂载等） |
| `docker-compose.prod.yml` | 生产配置 | 生产环境特定配置（安全、性能） |

---

## 🚀 快速开始

### 前提条件

- Docker >= 20.10
- Docker Compose >= 2.0
- 至少1GB可用磁盘空间

### 方式1：使用Docker Compose（推荐）

#### 🔧 开发环境（带热挂载）

```bash
# 构建开发镜像
docker-compose build zhinengxin-dev

# 启动开发环境（支持热更新）
docker-compose -f docker-compose.yml up zhinengxin-dev

# 访问应用
open http://localhost:5173
```

此时修改 `src/` 目录下的文件会自动触发热更新，无需重启容器。

#### 🏭 生产环境（精简版）

```bash
# 构建生产镜像
docker-compose build zhinengxin-prod

# 启动生产环境（后台运行）
docker-compose -f docker-compose.yml up -d zhinengxin-prod

# 查看日志
docker-compose logs -f zhinengxin-prod

# 访问应用
open http://localhost:3000

# 停止容器
docker-compose down
```

#### 🎯 同时运行Prod和Dev

```bash
# 启动两个环境
docker-compose up

# 这会启动：
# - zhinengxin-prod 在 http://localhost:3000
# - zhinengxin-dev 在 http://localhost:5173
```

---

### 方式2：直接使用Docker命令

#### 构建镜像

```bash
# 生产镜像
docker build --target production -t zhinengxin-ai:latest .

# 开发镜像
docker build --target development -t zhinengxin-ai:dev .

# 使用BuildKit加速（需要启用BuildKit）
DOCKER_BUILDKIT=1 docker build --target production -t zhinengxin-ai:latest .
```

#### 运行容器

```bash
# 生产环境
docker run -d \
  -p 3000:3000 \
  --name zhinengxin-prod \
  --restart unless-stopped \
  zhinengxin-ai:latest

# 开发环境（带热挂载）
docker run -it \
  -p 5173:5173 \
  -v $(pwd)/src:/app/src \
  --name zhinengxin-dev \
  zhinengxin-ai:dev
```

---

## 📊 镜像体积优化

### 构建信息查看

```bash
# 查看镜像大小
docker images | grep zhinengxin

# 查看分层信息（显示每层大小）
docker history zhinengxin-ai:latest

# 查看镜像详细信息
docker inspect zhinengxin-ai:latest
```

### 预期体积

| 镜像 | 预期大小 | 说明 |
|-----|---------|------|
| `zhinengxin-ai:latest` (prod) | ~200-300MB | 仅包含生产依赖+构建产物 |
| `zhinengxin-ai:dev` | ~500-600MB | 包含devDependencies和开发工具 |

### 体积优化技巧

如果镜像仍然过大，可以尝试：

1. **使用更小的基础镜像**：
   ```dockerfile
   # 改为 node:18-alpine3.18（更小的Alpine版本）
   FROM node:18-alpine3.18 AS dependencies
   ```

2. **删除不需要的包**：
   ```bash
   # 在Dockerfile中添加清理命令
   RUN apk del --no-cache git curl  # 生产环境可删除
   ```

3. **使用distroless镜像**（最小化）：
   ```dockerfile
   # 完全仅包含运行时，无包管理器
   FROM gcr.io/distroless/nodejs18-debian11 AS production
   COPY --from=builder /app/dist ./dist
   CMD ["dist/server.js"]
   ```

---

## 🔒 安全性检查清单

- [x] 非root用户运行（uid: 1001）
- [x] 生产镜像不包含源代码
- [x] 生产镜像不包含devDependencies
- [x] 只读文件系统支持（可选）
- [x] 健康检查配置
- [x] 敏感信息在.dockerignore中排除
- [ ] （可选）签名镜像 - 需配置Docker Content Trust
- [ ] （可选）漏洞扫描 - 可用Trivy或Snyk

### 安全扫描

```bash
# 使用Trivy扫描镜像漏洞
trivy image zhinengxin-ai:latest

# 使用Docker Scout（Docker Desktop内置）
docker scout cves zhinengxin-ai:latest
```

---

## 🛠️ 开发工作流

### 本地开发流程

```bash
# 1. 启动开发容器
docker-compose up zhinengxin-dev

# 2. 编辑src/目录的文件
# 3. 浏览器会自动热更新，无需重启

# 4. 查看日志（新终端）
docker-compose logs -f zhinengxin-dev

# 5. 运行测试（在容器内）
docker-compose exec zhinengxin-dev npm run test

# 6. 进入容器shell
docker-compose exec zhinengxin-dev sh

# 7. 完成后停止容器
docker-compose down
```

### 生成生产构建

```bash
# 本地测试生产镜像
docker build --target production -t zhinengxin-ai:test .
docker run -p 3000:3000 zhinengxin-ai:test

# 访问 http://localhost:3000 验证
```

---

## 🐳 Docker Compose 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f zhinengxin-dev      # 实时日志
docker-compose logs --tail=100 zhinengxin-prod  # 最后100行

# 进入容器
docker-compose exec zhinengxin-dev sh
docker-compose exec zhinengxin-prod sh

# 重启服务
docker-compose restart zhinengxin-dev

# 停止和删除
docker-compose stop                    # 只停止
docker-compose down                    # 停止并删除容器
docker-compose down -v                 # 停止、删除容器和卷

# 重新构建镜像
docker-compose build --no-cache zhinengxin-dev

# 查看容器内环境变量
docker-compose exec zhinengxin-dev env | grep NODE

# 执行一次性命令
docker-compose exec zhinengxin-dev npm run lint
docker-compose exec zhinengxin-dev npm run build
```

---

## 📦 镜像推送到仓库

### Docker Hub

```bash
# 登录Docker Hub
docker login

# 标记镜像
docker tag zhinengxin-ai:latest yourusername/zhinengxin-ai:latest
docker tag zhinengxin-ai:latest yourusername/zhinengxin-ai:v1.0.0

# 推送
docker push yourusername/zhinengxin-ai:latest
docker push yourusername/zhinengxin-ai:v1.0.0
```

### 阿里云容器仓库

```bash
# 登录
docker login --username=your_username registry.cn-hangzhou.aliyuncs.com

# 标记
docker tag zhinengxin-ai:latest registry.cn-hangzhou.aliyuncs.com/yournamespace/zhinengxin-ai:latest

# 推送
docker push registry.cn-hangzhou.aliyuncs.com/yournamespace/zhinengxin-ai:latest
```

---

## 🐙 Kubernetes 部署（可选）

如果使用Kubernetes，可参考以下资源定义：

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zhinengxin-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: zhinengxin-ai
  template:
    metadata:
      labels:
        app: zhinengxin-ai
    spec:
      containers:
      - name: zhinengxin-ai
        image: your-registry/zhinengxin-ai:latest
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 20
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: zhinengxin-ai-svc
spec:
  selector:
    app: zhinengxin-ai
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

```bash
# 应用到集群
kubectl apply -f deployment.yaml

# 查看部署
kubectl get deployments
kubectl get pods
```

---

## 🔍 故障排查

### 构建失败

```bash
# 增加日志详度
docker build --target production \
  --progress=plain \
  -t zhinengxin-ai:latest .

# 进入构建环境调试
docker build --target builder \
  -t zhinengxin-debug:latest .
docker run -it zhinengxin-debug:latest sh
```

### 容器启动失败

```bash
# 查看容器日志
docker logs container-id

# 查看启动命令
docker inspect container-id | grep Cmd

# 进入容器交互式shell
docker run -it zhinengxin-ai:latest sh
```

### 热更新不生效

```bash
# 检查卷挂载是否正确
docker-compose exec zhinengxin-dev mount | grep /app/src

# 检查文件权限
docker-compose exec zhinengxin-dev ls -la src/

# 查看Vite日志
docker-compose logs -f zhinengxin-dev | grep -i "vite\|update"
```

### 内存/性能问题

```bash
# 查看容器资源使用
docker stats

# 查看日志大小
docker logs container-id --tail=0 | wc -c

# 清理日志
docker logs container-id --tail=0 > /dev/null
```

---

## 📝 Dockerfile最佳实践说明

### 1. 多阶段构建（Multi-stage build）

```
dependencies (stage 1) 
    ↓ [安装npm包]
    ├→ builder (stage 2) [继承依赖 + 构建代码]
         ↓ [运行npm build，输出dist]
         ├→ production (stage 3) [仅复制dist + 精简依赖]
         └→ development (stage 4) [完整依赖 + 开发工具]
```

好处：
- 生产镜像只包含运行时需要的内容
- 开发镜像包含完整工具链

### 2. 分层缓存优化

```dockerfile
# ❌ 不好：每次代码改动都重新安装依赖
COPY . .
RUN npm ci

# ✅ 好：依赖单独一层，可复用缓存
COPY package*.json ./
RUN npm ci
COPY . .
```

docker会缓存每一层，只要COPY package*.json没变，npm ci会被缓存。

### 3. 非root用户

```dockerfile
# 创建用户时使用固定UID（便于权限管理）
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
```

好处：
- 容器逃逸风险降低
- 宿主机文件系统保护

### 4. 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1
```

好处：
- Docker和Kubernetes自动检测容器健康状态
- 无响应自动重启

---

## 📚 参考资源

- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [Dockerfile最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Docker官方镜像](https://hub.docker.com/_/node)
- [Kubernetes文档](https://kubernetes.io/docs/)

---

## 🎯 总结

| 场景 | 命令 | 说明 |
|------|------|------|
| 本地开发 | `docker-compose up zhinengxin-dev` | 热更新、快速迭代 |
| 本地测试生产构建 | `docker build --target production ...` | 验证生产镜像 |
| 部署到服务器 | `docker run -d -p 3000:3000 zhinengxin-ai:latest` | 后台运行 |
| CI/CD流程 | `docker build --target production ...` | 镜像构建 |

---

**祝你部署顺利！🚀**

如有问题，请查阅Dockerfile中的详细注释或参考本指南的故障排查章节。
