#!/bin/bash
# ============================================================================
# 智能鑫AI Docker 快速操作脚本
# 
# 用途：简化常见的Docker操作，提高工作效率
# 
# 使用方式：
# chmod +x docker-scripts.sh
# ./docker-scripts.sh [命令] [参数]
# 
# 可用命令：
#   build-dev      - 构建开发镜像
#   build-prod     - 构建生产镜像
#   run-dev        - 启动开发环境
#   run-prod       - 启动生产环境
#   stop           - 停止所有容器
#   logs           - 查看日志
#   shell-dev      - 进入开发容器shell
#   shell-prod     - 进入生产容器shell
#   clean          - 清理容器和镜像
#   scan           - 扫描镜像漏洞
# ============================================================================

set -e  # 任何命令失败都退出

# 颜色定义（便于输出）
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目名称
PROJECT_NAME="zhinengxin-ai"
DEV_IMAGE="${PROJECT_NAME}:dev"
PROD_IMAGE="${PROJECT_NAME}:latest"

# ============================================================================
# 工具函数
# ============================================================================

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# ============================================================================
# 构建函数
# ============================================================================

build_dev() {
    print_header "构建开发镜像"
    
    if docker build --target development -t "${DEV_IMAGE}" .; then
        print_success "开发镜像构建完成"
        docker images | grep "${PROJECT_NAME}"
    else
        print_error "开发镜像构建失败"
        exit 1
    fi
}

build_prod() {
    print_header "构建生产镜像"
    
    if docker build --target production -t "${PROD_IMAGE}" .; then
        print_success "生产镜像构建完成"
        docker images | grep "${PROJECT_NAME}"
    else
        print_error "生产镜像构建失败"
        exit 1
    fi
}

build_prod_buildkit() {
    print_header "使用BuildKit构建生产镜像（更快）"
    
    if DOCKER_BUILDKIT=1 docker build --target production -t "${PROD_IMAGE}" .; then
        print_success "生产镜像构建完成（使用BuildKit）"
    else
        print_error "BuildKit构建失败"
        exit 1
    fi
}

# ============================================================================
# 运行函数
# ============================================================================

run_dev() {
    print_header "启动开发环境"
    
    # 检查镜像是否存在
    if ! docker image inspect "${DEV_IMAGE}" > /dev/null 2>&1; then
        print_warning "开发镜像不存在，正在构建..."
        build_dev
    fi
    
    print_warning "启动开发容器..."
    docker-compose -f docker-compose.yml up zhinengxin-dev
}

run_prod() {
    print_header "启动生产环境"
    
    # 检查镜像是否存在
    if ! docker image inspect "${PROD_IMAGE}" > /dev/null 2>&1; then
        print_warning "生产镜像不存在，正在构建..."
        build_prod
    fi
    
    print_warning "启动生产容器..."
    docker-compose -f docker-compose.yml up -d zhinengxin-prod
    print_success "生产容器已启动，访问 http://localhost:3000"
}

run_both() {
    print_header "同时启动开发和生产环境"
    docker-compose up
}

# ============================================================================
# 停止和清理
# ============================================================================

stop() {
    print_header "停止所有容器"
    docker-compose down
    print_success "容器已停止"
}

clean() {
    print_header "清理容器、镜像和卷"
    
    print_warning "这会删除所有相关的容器、镜像和卷，确认继续？(y/N)"
    read -r confirm
    
    if [ "$confirm" != "y" ]; then
        print_warning "已取消清理操作"
        return
    fi
    
    # 停止并删除容器
    docker-compose down -v
    
    # 删除镜像
    docker rmi "${DEV_IMAGE}" 2>/dev/null || true
    docker rmi "${PROD_IMAGE}" 2>/dev/null || true
    
    print_success "清理完成"
}

# ============================================================================
# 日志查看
# ============================================================================

show_logs() {
    local service="${1:-zhinengxin-dev}"
    print_header "查看 ${service} 日志"
    docker-compose logs -f "${service}"
}

# ============================================================================
# 进入容器
# ============================================================================

shell_dev() {
    print_header "进入开发容器"
    docker-compose exec zhinengxin-dev sh
}

shell_prod() {
    print_header "进入生产容器"
    docker-compose exec zhinengxin-prod sh
}

# ============================================================================
# 镜像扫描和安全检查
# ============================================================================

scan() {
    print_header "扫描镜像漏洞（需要Trivy）"
    
    if ! command -v trivy &> /dev/null; then
        print_error "Trivy未安装，请访问 https://github.com/aquasecurity/trivy"
        return
    fi
    
    local image="${1:-${PROD_IMAGE}}"
    trivy image "${image}"
}

# ============================================================================
# 信息展示
# ============================================================================

show_images() {
    print_header "本地镜像信息"
    docker images | grep "${PROJECT_NAME}" || echo "暂无相关镜像"
}

show_containers() {
    print_header "运行中的容器"
    docker-compose ps
}

show_stats() {
    print_header "容器资源使用情况"
    docker stats
}

# ============================================================================
# 辅助函数
# ============================================================================

version() {
    echo "智能鑫AI Docker脚本 v1.0.0"
}

usage() {
    cat << EOF
使用方式: $0 [命令] [参数]

构建镜像:
  build-dev              构建开发镜像
  build-prod             构建生产镜像（标准）
  build-prod-fast        构建生产镜像（使用BuildKit加速）

运行环境:
  run-dev                启动开发环境（带热挂载）
  run-prod               启动生产环境（后台）
  run-both               同时启动两个环境

操作容器:
  stop                   停止所有容器
  logs [服务名]          查看容器日志（默认：zhinengxin-dev）
  shell-dev              进入开发容器shell
  shell-prod             进入生产容器shell
  ps                     显示容器状态
  stats                  显示容器资源使用

清理操作:
  clean                  删除容器、镜像和卷（需确认）

安全检查:
  scan [镜像名]          扫描镜像漏洞（需要Trivy）

其他命令:
  images                 显示本地镜像
  version                显示版本信息
  help                   显示帮助信息

示例:
  $0 build-dev           构建开发镜像
  $0 run-dev             启动开发环境
  $0 logs zhinengxin-dev 查看开发容器日志
  $0 shell-prod          进入生产容器shell

EOF
}

# ============================================================================
# 主函数
# ============================================================================

main() {
    # 如果没有参数，显示帮助
    if [ $# -eq 0 ]; then
        usage
        exit 0
    fi
    
    case "$1" in
        build-dev)
            build_dev
            ;;
        build-prod)
            build_prod
            ;;
        build-prod-fast)
            build_prod_buildkit
            ;;
        run-dev)
            run_dev
            ;;
        run-prod)
            run_prod
            ;;
        run-both)
            run_both
            ;;
        stop)
            stop
            ;;
        clean)
            clean
            ;;
        logs)
            show_logs "${2:-zhinengxin-dev}"
            ;;
        shell-dev)
            shell_dev
            ;;
        shell-prod)
            shell_prod
            ;;
        scan)
            scan "${2:-${PROD_IMAGE}}"
            ;;
        ps)
            show_containers
            ;;
        stats)
            show_stats
            ;;
        images)
            show_images
            ;;
        version)
            version
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            print_error "未知命令: $1"
            echo ""
            usage
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
