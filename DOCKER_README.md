# 🐳 Docker 配置文件说明

本项目已配置完整的Docker构建和部署方案，支持开发和生产两个环境。

## 📁 新增文件清单

| 文件 | 用途 | 优先级 |
|------|------|--------|
| `Dockerfile` | 核心构建文件（多阶段构建） | ⭐⭐⭐ |
| `.dockerignore` | 构建上下文优化（排除不需要文件） | ⭐⭐⭐ |
| `docker-compose.yml` | Prod/Dev两个服务定义 | ⭐⭐⭐ |
| `docker-compose.dev.yml` | 开发配置（热挂载） | ⭐⭐ |
| `docker-compose.prod.yml` | 生产配置（安全优化） | ⭐⭐ |
| `docker-scripts.ps1` | PowerShell快速命令脚本 | ⭐⭐ |
| `docker-scripts.sh` | Bash快速命令脚本 | ⭐⭐ |
| `DOCKER_DEPLOYMENT_GUIDE.md` | 完整部署指南 | ⭐⭐⭐ |
| `DOCKER_OPTIMIZATION_GUIDE.md` | 优化详解文档 | ⭐⭐ |

## 🚀 快速开始

### Windows PowerShell

```powershell
# 方式1：使用快速脚本（推荐）
.\docker-scripts.ps1 run-dev      # 启动开发环境
.\docker-scripts.ps1 run-prod     # 启动生产环境
.\docker-scripts.ps1 help         # 查看所有命令

# 方式2：直接使用Docker Compose
docker-compose up                 # 启动Prod和Dev
docker-compose -f docker-compose.yml up zhinengxin-dev   # 仅Dev
```

### Linux/Mac (Bash)

```bash
# 使用快速脚本
chmod +x docker-scripts.sh
./docker-scripts.sh run-dev
./docker-scripts.sh run-prod
./docker-scripts.sh help

# 或直接使用Docker Compose
docker-compose up
```

## ✨ 核心特性

### 1. 多阶段构建 ✓
- **dependencies**: 单独安装npm包（最大化缓存）
- **builder**: 编译代码生成dist目录
- **production**: 精简镜像，仅含生产依赖（260-290MB）
- **development**: 完整工具链，支持热更新（500-600MB）

### 2. 体积优化 ✓
- ✅ Alpine基础镜像（仅170MB）
- ✅ 多阶段构建（70-80%减少）
- ✅ .dockerignore优化（15-20%减少）
- ✅ npm ci + npm prune（5-10%减少）
- ✅ **最终大小: 260-290MB** (仅为ubuntu方案的1/4)

### 3. 多级缓存 ✓
- ✅ 依赖层单独缓存
- ✅ 源代码改动快速重建（1-2分钟）
- ✅ package.json改动清晰隔离
- ✅ 支持BuildKit加速

### 4. 两个出口 ✓
- **Dev出口** (`zhinengxin-dev`): 
  - 热挂载 `src/` 目录
  - Vite热更新
  - 完整调试工具
  - 访问: http://localhost:5173
  
- **Prod出口** (`zhinengxin-prod`):
  - 精简镜像
  - 仅生产依赖
  - 非root用户
  - 访问: http://localhost:3000

### 5. 安全运行 ✓
- ✅ 非root用户 (uid: 1001)
- ✅ 生产镜像无源代码
- ✅ 敏感信息在.dockerignore中排除
- ✅ 生产镜像无devDependencies
- ✅ 健康检查自动重启

### 6. 垃圾清理 ✓
- ✅ 全面的.dockerignore配置
- ✅ 排除: node_modules, .git, .env*, *.sql, docs等
- ✅ 减少构建上下文体积
- ✅ 加快docker build速度

## 📊 构建信息

### 预期镜像大小
```
zhinengxin-ai:dev      ~500-600MB   (开发镜像)
zhinengxin-ai:latest   ~260-290MB   (生产镜像)
```

### 预期构建时间
- **首次构建**: 2-3分钟
- **修改代码后**: 1-2分钟（缓存命中）
- **修改package.json**: 3-5分钟（需要npm ci）

### 运行时内存占用
- **Dev环境**: 200-400MB
- **Prod环境**: 100-200MB

## 🎯 常用命令速查表

### PowerShell版本
```powershell
.\docker-scripts.ps1 build-dev       # 构建开发镜像
.\docker-scripts.ps1 run-dev         # 启动开发环境（热挂载）
.\docker-scripts.ps1 run-prod        # 启动生产环境
.\docker-scripts.ps1 run-both        # 同时启动两个环境
.\docker-scripts.ps1 logs dev        # 查看开发日志
.\docker-scripts.ps1 shell-dev       # 进入开发容器
.\docker-scripts.ps1 stop            # 停止所有容器
.\docker-scripts.ps1 clean           # 清理镜像和容器
.\docker-scripts.ps1 scan            # 扫描镜像漏洞
.\docker-scripts.ps1 help            # 显示帮助
```

### Bash版本
```bash
./docker-scripts.sh build-dev        # 构建开发镜像
./docker-scripts.sh run-dev          # 启动开发环境
./docker-scripts.sh run-prod         # 启动生产环境
./docker-scripts.sh logs dev         # 查看开发日志
./docker-scripts.sh shell-dev        # 进入开发容器
./docker-scripts.sh stop             # 停止所有容器
./docker-scripts.sh clean            # 清理镜像和容器
./docker-scripts.sh help             # 显示帮助
```

### 直接使用Docker Compose
```bash
# 启动特定服务
docker-compose up zhinengxin-dev     # 仅Dev
docker-compose up zhinengxin-prod    # 仅Prod
docker-compose up                    # 同时启动两个

# 后台运行
docker-compose up -d zhinengxin-prod

# 查看日志
docker-compose logs -f zhinengxin-dev

# 进入容器
docker-compose exec zhinengxin-dev sh

# 停止
docker-compose down
docker-compose down -v               # 同时删除卷

# 重新构建
docker-compose build --no-cache zhinengxin-dev
```

## 📖 详细文档

### 新手入门
👉 **[DOCKER_DEPLOYMENT_GUIDE.md](./DOCKER_DEPLOYMENT_GUIDE.md)**
- 前提条件检查
- 快速开始教程
- 常见问题解答
- Kubernetes部署示例

### 深度优化
👉 **[DOCKER_OPTIMIZATION_GUIDE.md](./DOCKER_OPTIMIZATION_GUIDE.md)**
- 多阶段构建详解
- 缓存策略原理
- 体积优化技巧
- 性能监控

### Dockerfile注释
👉 **[Dockerfile](./Dockerfile)**
- 每个stage的详细注释
- 优化思路说明
- 替代方案讨论

## 🔍 检查清单

使用前请验证以下条件：

- [ ] Docker >= 20.10 (`docker --version`)
- [ ] Docker Compose >= 2.0 (`docker-compose --version`)
- [ ] 至少1GB可用磁盘空间
- [ ] 可以访问Docker Hub（下载基础镜像）
- [ ] PowerShell执行策略已配置（Windows）
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

## 🐛 故障排查

### Docker命令不可用
```bash
# 检查Docker安装
docker --version

# 启动Docker daemon
# Windows: Docker Desktop应用
# Linux: sudo systemctl start docker
```

### PowerShell脚本执行失败
```powershell
# 允许本地脚本执行
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 镜像构建失败
```bash
# 使用详细输出重新构建
docker build --target production \
  --progress=plain \
  -t zhinengxin-ai:latest .

# 查看错误日志
docker logs <container-id>
```

### 热挂载不生效
```bash
# 验证卷挂载
docker-compose exec zhinengxin-dev mount | grep /app/src

# 检查文件权限
docker-compose exec zhinengxin-dev ls -la src/
```

## 💡 最佳实践

1. **开发时**
   ```powershell
   .\docker-scripts.ps1 run-dev
   # 修改src下的文件，浏览器自动更新
   ```

2. **测试生产构建**
   ```powershell
   .\docker-scripts.ps1 build-prod
   .\docker-scripts.ps1 run-prod
   # 访问 http://localhost:3000 验证
   ```

3. **部署到服务器**
   ```bash
   docker build --target production -t zhinengxin-ai:v1.0.0 .
   docker push your-registry/zhinengxin-ai:v1.0.0
   ```

4. **定期清理**
   ```bash
   docker system prune -a  # 删除未使用的镜像
   ```

## 📚 参考资源

- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [Dockerfile最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Alpine Linux](https://alpinelinux.org/)
- [Node.js官方Docker镜像](https://hub.docker.com/_/node)

## 🎓 学习路径

1. **Level 1 - 快速开始**
   - 阅读本文件
   - 运行 `.\docker-scripts.ps1 run-dev`
   - 修改代码观察热更新

2. **Level 2 - 理解原理**
   - 阅读 Dockerfile 中的注释
   - 查看 DOCKER_DEPLOYMENT_GUIDE.md 的常用命令部分
   - 运行 `docker history zhinengxin-ai:latest` 理解分层

3. **Level 3 - 深度优化**
   - 研究 DOCKER_OPTIMIZATION_GUIDE.md 中的优化原理
   - 修改 Dockerfile 尝试不同配置
   - 对比不同方案的构建速度和镜像大小

4. **Level 4 - 生产部署**
   - 学习 Kubernetes 部署示例
   - 配置镜像仓库和CI/CD
   - 实施安全扫描和镜像签名

## 📞 获取帮助

- 查看脚本帮助: `.\docker-scripts.ps1 help`
- 查看部署指南: `DOCKER_DEPLOYMENT_GUIDE.md`
- 查看优化指南: `DOCKER_OPTIMIZATION_GUIDE.md`
- 进入容器调试: `.\docker-scripts.ps1 shell-dev`
- 查看容器日志: `.\docker-scripts.ps1 logs zhinengxin-dev`

---

**祝你使用愉快！🚀**

如有问题，请参考详细文档或查看Dockerfile中的详细注释。
