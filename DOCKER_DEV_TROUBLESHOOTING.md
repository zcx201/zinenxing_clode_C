# 🔧 Docker 开发环境故障排查指南

## 问题1：`the attribute 'version' is obsolete` 警告

### 原因
`docker-compose.dev.yml` 不应该声明 `version` 字段，因为它会继承基础 `docker-compose.yml` 的版本。

### 解决方案 ✅
已修复：移除了 `docker-compose.dev.yml` 中的 `version: '3.9'` 行。

### 验证
```bash
# 运行时应该没有 version 相关的警告
docker-compose -f docker-compose.yml -f docker-compose.dev.yml config | grep version
```

---

## 问题2：`no service selected` 错误

### 原因
使用 `docker-compose -f docker-compose.dev.yml up` 时，只加载开发配置文件，但该文件中定义的服务依赖于基础配置文件中的定义。

### 解决方案 ✅
必须同时加载基础配置和开发配置：

```bash
# ✅ 正确方式：同时加载两个文件
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# ❌ 错误方式：只加载开发配置（会导致"no service selected"）
docker-compose -f docker-compose.dev.yml up -d
```

### 文件加载顺序
```
docker-compose.yml（基础配置）
    ↓
docker-compose.dev.yml（开发覆盖配置）
    ↓
合并后的最终配置
```

---

## 问题3：镜像构建失败

### 场景A：`npm install` 失败
```
ERROR [dependencies 2/3] RUN npm ci --legacy-peer-deps
error code ERESOLVE
Could not resolve dependency: react-router-dom@6.15.0
```

**原因**：npm 包版本冲突

**解决方案**：
```dockerfile
# 在dependencies阶段添加
RUN npm ci --legacy-peer-deps --verbose

# 或使用npm install代替npm ci
RUN npm install --legacy-peer-deps --no-fund
```

已修复：Dockerfile 中已添加 `--legacy-peer-deps`。

### 场景B：构建超时
```
ERROR: command /bin/sh -c npm ci... failed: exit code 1
```

**原因**：npm 仓库连接缓慢或超时

**解决方案**：
```bash
# 1. 使用淘宝镜像（仅中国用户）
npm config set registry https://registry.npmmirror.com

# 2. 重新构建
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache

# 3. 或增加超时时间
docker build --build-arg NPM_CONFIG_FETCH_TIMEOUT=120000 -t zhinengxin-ai:dev .
```

### 场景C：`npm run build` 失败

```
ERROR: RUN npm run build
vite v4.4.5 building for production...
error during build:
Cannot find module '@vitejs/plugin-react'
```

**原因**：依赖未正确安装或node_modules被污染

**解决方案**：
```bash
# 1. 完全清理Docker缓存
docker-compose down -v
docker system prune -a --volumes

# 2. 重新构建（不使用缓存）
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache

# 3. 启动
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

---

## 问题4：容器无法启动

### 现象
```
docker-compose up -d
# 几秒钟后
docker-compose ps
# zhinengxin-dev   Exited (1) 5 seconds ago
```

### 排查步骤

**第1步：查看日志**
```bash
docker-compose logs zhinengxin-dev

# 或查看更多行
docker-compose logs --tail=100 zhinengxin-dev
```

**第2步：常见错误信息及解决方案**

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `EADDRINUSE: address already in use :::5173` | 端口被占用 | 修改端口或关闭占用进程 |
| `vite: command not found` | Vite未安装 | 检查 package.json，重新构建 |
| `npm run dev: command not found` | npm脚本错误 | 检查 package.json 中是否有 `dev` 脚本 |
| `Cannot find module 'react'` | node_modules缺失或污染 | 删除卷重建：`docker-compose down -v` |
| `EACCES: permission denied` | 文件权限问题 | Dockerfile中的 `chown -R nodejs:nodejs /app` 应该有效 |

### 调试技巧：进入容器检查

```bash
# 1. 启动一个交互式容器进行调试
docker exec -it zhinengxin-dev sh

# 2. 在容器内检查
ls -la /app/                        # 查看文件是否存在
npm list                            # 列出安装的包
npm run dev                         # 手动运行开发服务器（看完整错误）
cat package.json | grep '"dev"'    # 验证dev脚本存在

# 3. 检查权限
whoami                              # 应该显示 nodejs
id                                  # 应该显示 uid=1001

# 4. 退出
exit
```

---

## 问题5：无法访问 http://localhost:5173

### 检查列表

```bash
# 1. 容器是否正在运行
docker-compose ps
# NAME         STATUS
# zhinengxin-dev  Up (healthy)  <- 必须显示Up并最终显示healthy

# 2. 端口映射是否正确
docker-compose port zhinengxin-dev 5173
# 应该返回：0.0.0.0:5173

# 3. 从容器内测试
docker exec zhinengxin-dev curl http://localhost:5173
# 应该返回 HTML 响应

# 4. 从主机测试
curl http://localhost:5173
# 应该返回 HTML 响应

# 5. 如果curl命令不存在
docker exec zhinengxin-dev sh -c "apt-get update && apt-get install -y curl"
```

### 端口被占用

```bash
# Windows
netstat -ano | findstr :5173
# 如果输出显示 LISTENING，说明端口被占用

# Linux/Mac
lsof -i :5173
# 查看哪个进程占用了端口

# 解决：修改 docker-compose.dev.yml 的端口映射
# ports:
#   - "5174:5173"  # 改成5174
```

---

## 问题6：代码修改没有热更新

### 原因检查

```bash
# 1. 检查src卷挂载是否正确
docker inspect zhinengxin-dev | grep -A5 Mounts
# 应该显示：Source: /本地路径, Destination: /app, Mode: rw,cached

# 2. 检查Vite HMR配置
docker exec zhinengxin-dev sh -c "env | grep VITE_HMR"
# 应该显示：
# VITE_HMR_HOST=localhost
# VITE_HMR_PORT=5173
# VITE_HMR_PROTOCOL=ws

# 3. 查看Vite日志（是否有HMR连接信息）
docker-compose logs zhinengxin-dev | grep -i "hmr\|connected\|update"
```

### 解决方案

**方案1：检查挂载配置**
```yaml
# docker-compose.dev.yml
volumes:
  - .:/app:cached              # ← 确保这一行存在
  - zhinengxin-dev-node-modules:/app/node_modules
```

**方案2：检查package.json的dev脚本**
```json
{
  "scripts": {
    "dev": "vite"    // ← 应该只有这样，不需要--host等参数
  }
}
```

**方案3：强制重启容器**
```bash
docker-compose restart zhinengxin-dev
docker-compose logs -f zhinengxin-dev
```

---

## 问题7：node_modules出错（匿名卷问题）

### 现象
```
Cannot find module 'react'
Cannot find module 'vite'
```

### 原因
本地 `node_modules` 目录为空或不存在，但卷挂载顺序不正确导致容器内的 `node_modules` 被本地空目录覆盖。

### 解决方案 ✅

**已优化：卷挂载顺序**
```yaml
volumes:
  # 第1步：挂载整个项目目录
  - .:/app:cached
  # 第2步：用命名卷覆盖node_modules（保护依赖）
  - zhinengxin-dev-node-modules:/app/node_modules
```

**如果问题仍然存在**：
```bash
# 1. 删除污染的卷
docker-compose down -v

# 2. 删除本地node_modules（如果存在）
rm -rf node_modules

# 3. 重新构建和启动
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# 4. 验证卷已正确创建
docker volume ls | grep zhinengxin-dev-node-modules
```

---

## 问题8：Windows WSL2 网络问题

### 现象
```
curl: (7) Failed to connect to localhost port 5173: Connection refused
```

### 原因
WSL2与Windows主机间的网络配置问题

### 解决方案

**方案1：使用 `host.docker.internal`**
```bash
# 从WSL2内访问主机服务
curl http://host.docker.internal:5173
```

**方案2：使用Docker的网络IP**
```bash
# 获取docker容器的IP地址
docker inspect zhinengxin-dev | grep IPAddress
# 例如：172.20.0.2

# 然后访问
curl http://172.20.0.2:5173
```

**方案3：修改Vite HMR配置**
```yaml
# docker-compose.dev.yml
environment:
  VITE_HMR_HOST: host.docker.internal
  VITE_HMR_PORT: 5173
  VITE_HMR_PROTOCOL: ws
```

---

## 问题9：内存不足或容器崩溃

### 现象
```
Cannot allocate memory
OOM Killer invoked
```

### 检查内存使用
```bash
docker stats zhinengxin-dev

# 或查看历史记录
docker logs zhinengxin-dev | grep -i "memory\|oom"
```

### 增加内存限制
```yaml
# docker-compose.dev.yml
deploy:
  resources:
    limits:
      memory: 3G    # 改成3GB
    reservations:
      memory: 2G    # 改成2GB
```

### 清理无用的容器和镜像
```bash
# 删除停止的容器
docker container prune

# 删除悬空的镜像
docker image prune

# 完全清理（谨慎！）
docker system prune -a --volumes
```

---

## 快速诊断命令

复制粘贴以下命令快速诊断问题：

```bash
echo "=== 1. Docker版本 ==="
docker --version && docker-compose --version

echo -e "\n=== 2. 容器状态 ==="
docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps

echo -e "\n=== 3. 最近的日志（最后20行） ==="
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=20 zhinengxin-dev

echo -e "\n=== 4. 卷列表 ==="
docker volume ls | grep zhinengxin

echo -e "\n=== 5. 网络列表 ==="
docker network ls | grep zhinengxin

echo -e "\n=== 6. 镜像列表 ==="
docker images | grep zhinengxin

echo -e "\n=== 7. 内存/CPU使用 ==="
docker stats --no-stream zhinengxin-dev

echo -e "\n=== 8. 端口绑定 ==="
docker-compose port zhinengxin-dev 5173
```

---

## 完全重置（核选项）

如果所有方法都失败，进行完全重置：

```bash
# ⚠️ 警告：这会删除所有Docker相关的数据！

# 1. 停止并删除所有容器和卷
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v

# 2. 删除所有悬空的镜像和卷
docker system prune -a --volumes

# 3. 删除本地依赖（可选）
rm -rf node_modules package-lock.json

# 4. 重新构建
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache

# 5. 重新启动
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 6. 查看日志
docker-compose logs -f zhinengxin-dev
```

---

## 问题仍未解决？

### 收集诊断信息

运行以下命令并保存输出：

```bash
# 保存所有诊断信息到文件
{
  echo "=== Docker Compose Config ===" 
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml config
  
  echo -e "\n=== Container Inspect ===" 
  docker inspect zhinengxin-dev
  
  echo -e "\n=== Logs ===" 
  docker-compose logs zhinengxin-dev
  
} > docker-diagnosis.txt

echo "诊断信息已保存到 docker-diagnosis.txt"
```

然后：
1. 检查 `docker-diagnosis.txt` 中的错误信息
2. 参考此指南中的相应章节
3. 如有需要，提供此文件给技术支持

---

## 预防措施

### 最佳实践

1. **总是使用完整的命令**
   ```bash
   # ✅ 好
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
   
   # ❌ 不好
   docker-compose up
   ```

2. **定期更新镜像**
   ```bash
   docker pull node:18-alpine
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
   ```

3. **监控日志**
   ```bash
   docker-compose logs -f zhinengxin-dev
   ```

4. **定期清理**
   ```bash
   docker system prune --volumes
   docker builder prune
   ```

5. **检查资源使用**
   ```bash
   docker stats
   ```

---

## 相关文档

- `DOCKER_QUICK_REFERENCE.md` - 快速命令参考
- `DOCKER_PRODUCTION_GUIDE.md` - 完整的Docker指南
- `START_HERE.md` - 5分钟快速开始
- `docker-compose.yml` - 基础配置
- `docker-compose.dev.yml` - 开发配置（已修复）
- `Dockerfile` - 镜像定义（已修复）

---

最后更新：2026-01-12  
状态：已优化和验证 ✅
