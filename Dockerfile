# ============================================================================
# 智能鑫AI - React Vite 应用 Dockerfile
# 
# 特性：
# - 多阶段构建（依赖安装 → 代码编译 → 精简运行环境）
# - 分层缓存优化（快速重建）
# - Dev/Prod 双出口支持（热挂载开发 & 安全生产）
# - 最小化镜像体积
# - 非root安全运行
# ============================================================================

# ============================================================================
# 第一阶段：Node.js 依赖层（用于安装所有npm包）
# 目的：独立缓存依赖层，避免代码改动后重新安装
# ============================================================================
FROM node:18-alpine AS dependencies

LABEL maintainer="智能鑫AI <dev@zhinengxin.ai>"

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
# 分离这一步是为了最大化缓存利用率
# 只有当package*.json改变时，才会重新安装依赖
COPY package*.json ./

# 安装npm依赖
# --legacy-peer-deps: 处理peer依赖警告（如需要）
# --production=false: 包含devDependencies（构建时需要）
RUN npm ci --legacy-peer-deps && \
    npm install -g serve && \
    npm cache clean --force

# ============================================================================
# 第二阶段：编译层（将源代码编译为静态文件）
# 目的：Vite构建 React + Tailwind CSS，输出到dist目录
# ============================================================================
FROM node:18-alpine AS builder

LABEL stage=intermediate

WORKDIR /app

# 从dependencies阶段复制已安装的node_modules
# 避免重复安装，加快构建速度
COPY --from=dependencies /app/node_modules ./node_modules

# 复制整个项目文件（除了.dockerignore排除的文件）
COPY . .

# 设置环境变量为生产构建模式
ENV NODE_ENV=production

# 执行Vite build命令，输出到dist目录
# 这会生成优化后的静态文件（HTML、JS、CSS）
RUN npm run build

# 构建完成后验证dist目录是否存在
# 如果构建失败，Docker构建会立即失败（fail fast）
RUN test -d dist || (echo "Build failed: dist directory not found" && exit 1)

# ============================================================================
# 第三阶段：生产环境镜像（Prod出口）
# 目的：最小化镜像体积，只包含运行所需的内容
# ============================================================================
FROM node:18-alpine AS production

LABEL stage=final environment=production

WORKDIR /app

# ============ 安全性配置 ============

# 创建非root用户，用于运行应用
# 这是安全最佳实践，防止容器以root身份运行
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# ============ 生产环境依赖安装 ============

# 复制package.json（用于参考依赖版本）
COPY package*.json ./

# 只安装生产环境依赖
# --production=true 会跳过devDependencies，减少镜像体积
# --legacy-peer-deps: 处理peer依赖（如需要）
RUN npm ci --production --legacy-peer-deps && \
    # 清理npm缓存，减少镜像体积
    npm cache clean --force

# ============ 构建产物复制 ============

# 从builder阶段复制已构建的静态文件（dist目录）
COPY --from=builder /app/dist ./dist

# ============ 运行时优化 ============

# 转换为非root用户
USER nodejs

# ============ 应用配置 ============

# 暴露端口
# 注：这是文档化端口，实际由serve或HTTP服务器决定
EXPOSE 3000

# 健康检查（确保容器正常运行）
# 检查dist目录是否存在并可访问
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD test -d /app/dist || exit 1

# ============ 启动命令（生产环境）============
# 
# 选项1: 使用serve包（推荐）
# 如果使用，需要在dependencies阶段添加serve到devDependencies
# CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
#
# 选项2: 使用Node.js内置HTTP服务器（最小化）
# 需要在项目根目录创建server.js文件
# CMD ["node", "server.js"]
#
# 当前使用简单的HTTP服务器
# 建议在生产环境中使用Nginx反向代理或负载均衡器
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]

# ============================================================================
# 第四阶段：开发环境镜像（Dev出口）
# 目的：支持热挂载、热更新，便于本地开发
# ============================================================================
FROM node:18-alpine AS development

LABEL stage=final environment=development

WORKDIR /app

# ============ 开发工具安装 ============

# 安装一些实用的开发工具
RUN apk add --no-cache \
    # git: 用于版本控制，某些npm包可能需要
    git \
    # curl: 用于健康检查和调试
    curl

# ============ 依赖安装 ============

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装完整的依赖（包括devDependencies）
# 开发环境需要Vite、ESLint、测试框架等工具
RUN npm ci --legacy-peer-deps && \
    npm cache clean --force

# ============ 项目文件挂载 ============

# 复制项目文件
# 在实际运行时，会用-v挂载本地src目录覆盖此文件，实现热更新
COPY . .

# ============ 用户配置（可选） ============

# 开发环境也使用非root用户（保持安全一致性）
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# ============ 应用配置 ============

# 暴露端口（Vite默认5173）
EXPOSE 5173

# Vite HMR（Hot Module Replacement）配置
# 开发环境下使用热更新
ENV VITE_HMR_HOST=localhost
ENV VITE_HMR_PORT=5173
ENV VITE_HMR_PROTOCOL=ws

# 健康检查（检查Vite开发服务器是否运行）
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5173 || exit 1

# ============ 启动命令（开发环境） ============
#
# 开发环境启动Vite开发服务器
# 使用 --host 0.0.0.0 使得容器外可访问
# 使用 --port 5173 指定开发服务器端口
# 使用 --strict-port 确保端口可用
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ============================================================================
# 使用方式：
# 
# 【生产构建】
# docker build --target production -t zhinengxin-ai:latest .
# docker run -d -p 3000:3000 --name zhinengxin-prod zhinengxin-ai:latest
#
# 【开发构建 - 带热挂载】
# docker build --target development -t zhinengxin-ai:dev .
# docker run -it -p 5173:5173 -v ${PWD}/src:/app/src --name zhinengxin-dev zhinengxin-ai:dev
#
# 【在docker-compose中使用】
# 
# 生产环境:
# services:
#   zhinengxin-prod:
#     build:
#       context: .
#       target: production
#     ports:
#       - "3000:3000"
#     restart: always
#
# 开发环境:
# services:
#   zhinengxin-dev:
#     build:
#       context: .
#       target: development
#     ports:
#       - "5173:5173"
#     volumes:
#       - ./src:/app/src
#     environment:
#       - VITE_HMR_HOST=localhost
#
# ============================================================================
