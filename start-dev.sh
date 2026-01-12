#!/bin/bash
# ============================================================================
# 智能鑫AI - Docker 开发环境启动脚本
# 用途：一键启动开发环境，自动处理常见问题
# 
# 使用方式：
# chmod +x start-dev.sh
# ./start-dev.sh
# ============================================================================

set -e  # 遇到错误立即退出

# 颜色输出函数
print_info() {
    echo -e "\033[36m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo -e "\033[33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

# ============================================================================
# 步骤1：检查环境
# ============================================================================

print_info "检查Docker环境..."

if ! command -v docker &> /dev/null; then
    print_error "Docker未安装。请先安装Docker。"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose未安装。请先安装Docker Compose。"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
COMPOSE_VERSION=$(docker-compose --version)

print_success "Docker已安装：$DOCKER_VERSION"
print_success "Docker Compose已安装：$COMPOSE_VERSION"

# ============================================================================
# 步骤2：清理旧的资源（可选）
# ============================================================================

print_info "检查是否存在旧的容器和卷..."

if docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps 2>/dev/null | grep -q zhinengxin-dev; then
    print_warning "发现已存在的开发环境。"
    read -p "是否清理旧的容器？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "停止并删除旧容器..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
        print_success "旧容器已清理"
    fi
fi

# ============================================================================
# 步骤3：检查端口可用性
# ============================================================================

print_info "检查关键端口是否可用..."

check_port() {
    if lsof -i :$1 &> /dev/null; then
        print_warning "端口 $1 已被占用"
        return 1
    else
        print_success "端口 $1 可用"
        return 0
    fi
}

# 尝试检查端口（lsof可能不存在于Windows）
if command -v lsof &> /dev/null; then
    check_port 5173 || print_warning "Vite端口(5173)被占用，请关闭占用进程或修改配置"
else
    print_info "跳过端口检查（lsof不可用）"
fi

# ============================================================================
# 步骤4：验证配置文件
# ============================================================================

print_info "验证Docker配置文件..."

if [ ! -f "docker-compose.yml" ]; then
    print_error "找不到 docker-compose.yml"
    exit 1
fi

if [ ! -f "docker-compose.dev.yml" ]; then
    print_error "找不到 docker-compose.dev.yml"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    print_error "找不到 Dockerfile"
    exit 1
fi

print_success "所有配置文件都存在"

# ============================================================================
# 步骤5：验证docker-compose配置语法
# ============================================================================

print_info "验证Docker Compose配置语法..."

if ! docker-compose -f docker-compose.yml -f docker-compose.dev.yml config > /dev/null 2>&1; then
    print_error "Docker Compose配置有错误"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml config
    exit 1
fi

print_success "Docker Compose配置正确"

# ============================================================================
# 步骤6：构建镜像
# ============================================================================

print_info "构建Docker镜像（这可能需要2-5分钟）..."

if ! docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache; then
    print_error "镜像构建失败"
    print_info "查看上面的错误信息并参考 DOCKER_DEV_TROUBLESHOOTING.md"
    exit 1
fi

print_success "镜像构建成功"

# ============================================================================
# 步骤7：启动容器
# ============================================================================

print_info "启动开发环境容器..."

if ! docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d; then
    print_error "容器启动失败"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs
    exit 1
fi

print_success "容器已启动"

# ============================================================================
# 步骤8：等待容器健康
# ============================================================================

print_info "等待容器完全启动（这需要10-30秒）..."

MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    STATUS=$(docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps zhinengxin-dev 2>/dev/null | grep zhinengxin-dev | awk '{print $NF}')
    
    if echo "$STATUS" | grep -q "healthy"; then
        print_success "容器已完全启动并健康"
        break
    elif echo "$STATUS" | grep -q "starting"; then
        print_info "容器正在启动... ($ATTEMPT/$MAX_ATTEMPTS)"
        sleep 1
        ATTEMPT=$((ATTEMPT + 1))
    else
        print_warning "容器状态: $STATUS"
        sleep 1
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
    print_warning "容器启动超时，但可能仍在初始化中"
    print_info "查看日志："
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs zhinengxin-dev
fi

# ============================================================================
# 步骤9：显示信息
# ============================================================================

print_success "=================================="
print_success "✅ 开发环境启动成功！"
print_success "=================================="

echo ""
print_info "访问地址："
echo "  🌐 前端应用:  http://localhost:5173"
echo "  📝 日志命令:  docker-compose logs -f zhinengxin-dev"
echo "  🛑 停止容器:  docker-compose -f docker-compose.yml -f docker-compose.dev.yml down"
echo ""

print_info "常用命令："
echo "  查看实时日志:     ./view-logs.sh"
echo "  停止容器:         ./stop-dev.sh"
echo "  进入容器shell:    docker exec -it zhinengxin-dev sh"
echo ""

print_info "进一步了解："
echo "  快速参考:         DOCKER_QUICK_REFERENCE.md"
echo "  完整教程:         DOCKER_PRODUCTION_GUIDE.md"
echo "  故障排查:         DOCKER_DEV_TROUBLESHOOTING.md"
echo ""

# ============================================================================
# 步骤10：可选的自动打开浏览器
# ============================================================================

if command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    # macOS
    open http://localhost:5173
elif command -v start &> /dev/null; then
    # Windows
    start http://localhost:5173
else
    print_info "请手动在浏览器中打开 http://localhost:5173"
fi

print_success "完成！"
