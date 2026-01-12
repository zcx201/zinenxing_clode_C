#!/bin/bash
# ============================================================================
# Docker 环境检查脚本
#
# 用途：检查Docker环境是否满足要求
# 使用：bash docker-check.sh (Linux/Mac)
# ============================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 计数器
PASSED=0
FAILED=0
WARNING=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      智能鑫AI - Docker 环境检查工具                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================================
# 检查函数
# ============================================================================

check_command() {
    local cmd=$1
    local min_version=$2
    local name=$3
    
    if command -v $cmd &> /dev/null; then
        version=$($cmd --version 2>&1 | head -n1)
        echo -e "${GREEN}✓${NC} $name: $version"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $name: 未安装"
        ((FAILED++))
        return 1
    fi
}

check_disk_space() {
    local required_gb=$1
    
    if [ "$(uname)" == "Darwin" ]; then
        # macOS
        available=$(df -Bg . | awk 'NR==2 {print $4}' | sed 's/G//')
    else
        # Linux
        available=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
    fi
    
    if [ "$available" -ge "$required_gb" ]; then
        echo -e "${GREEN}✓${NC} 磁盘空间: ${available}GB (需要 ≥ ${required_gb}GB)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} 磁盘空间: ${available}GB (需要 ≥ ${required_gb}GB)"
        ((FAILED++))
        return 1
    fi
}

check_docker_daemon() {
    if docker ps &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker daemon: 运行中"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} Docker daemon: 未运行"
        echo -e "  ${YELLOW}提示${NC}: 请启动Docker daemon"
        ((FAILED++))
        return 1
    fi
}

check_file() {
    local file=$1
    local desc=$2
    
    if [ -f "$file" ]; then
        size=$(du -h "$file" | awk '{print $1}')
        echo -e "${GREEN}✓${NC} $desc: $file ($size)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $desc: 文件不存在 - $file"
        ((FAILED++))
        return 1
    fi
}

# ============================================================================
# 开始检查
# ============================================================================

echo -e "${BLUE}【系统信息】${NC}"
echo -e "OS: $(uname -s)"
echo -e "Arch: $(uname -m)"
echo ""

echo -e "${BLUE}【必需工具】${NC}"
check_command docker "20.10" "Docker"
check_command docker-compose "2.0" "Docker Compose"
echo ""

echo -e "${BLUE}【Docker 守护进程】${NC}"
check_docker_daemon
echo ""

echo -e "${BLUE}【系统资源】${NC}"
check_disk_space 1
echo ""

echo -e "${BLUE}【项目文件】${NC}"
check_file "Dockerfile" "Dockerfile"
check_file ".dockerignore" ".dockerignore"
check_file "docker-compose.yml" "docker-compose.yml"
check_file "package.json" "package.json"
echo ""

echo -e "${BLUE}【可选工具】${NC}"
if command -v trivy &> /dev/null; then
    echo -e "${GREEN}✓${NC} Trivy (镜像扫描): 已安装"
    ((PASSED++))
else
    echo -e "${YELLOW}~${NC} Trivy (镜像扫描): 未安装 (可选)"
    echo -e "  ${YELLOW}提示${NC}: npm install -g trivy"
    ((WARNING++))
fi

if command -v git &> /dev/null; then
    echo -e "${GREEN}✓${NC} Git: 已安装"
    ((PASSED++))
else
    echo -e "${YELLOW}~${NC} Git: 未安装 (可选)"
    ((WARNING++))
fi
echo ""

# ============================================================================
# Docker 额外检查
# ============================================================================

echo -e "${BLUE}【Docker 功能检查】${NC}"

# 检查镜像
if docker images &> /dev/null; then
    image_count=$(docker images | wc -l)
    echo -e "${GREEN}✓${NC} Docker镜像: $image_count 个本地镜像"
else
    echo -e "${RED}✗${NC} 无法列出Docker镜像"
fi

# 检查卷
if docker volume ls &> /dev/null; then
    volume_count=$(docker volume ls -q | wc -l)
    echo -e "${GREEN}✓${NC} Docker卷: $volume_count 个本地卷"
else
    echo -e "${RED}✗${NC} 无法列出Docker卷"
fi

# 检查网络
if docker network ls &> /dev/null; then
    network_count=$(docker network ls | wc -l)
    echo -e "${GREEN}✓${NC} Docker网络: $network_count 个本地网络"
else
    echo -e "${RED}✗${NC} 无法列出Docker网络"
fi
echo ""

# ============================================================================
# 总结
# ============================================================================

echo -e "${BLUE}【检查结果】${NC}"
echo -e "${GREEN}通过: $PASSED${NC} | ${RED}失败: $FAILED${NC} | ${YELLOW}警告: $WARNING${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ 环境检查完成！所有必需条件都满足。${NC}"
    echo ""
    echo -e "下一步，你可以运行:"
    echo -e "  ${BLUE}docker-compose up zhinengxin-dev${NC}     # 启动开发环境"
    echo -e "  ${BLUE}docker-compose up zhinengxin-prod${NC}    # 启动生产环境"
    echo ""
    exit 0
else
    echo -e "${RED}✗ 环境检查失败！请修复上述问题后重试。${NC}"
    echo ""
    
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}如何安装Docker:${NC}"
        echo -e "  Ubuntu/Debian: sudo apt-get install docker.io"
        echo -e "  macOS: brew install docker"
        echo -e "  Windows: 下载 Docker Desktop (https://www.docker.com/products/docker-desktop)"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${YELLOW}如何安装Docker Compose:${NC}"
        echo -e "  Ubuntu/Debian: sudo apt-get install docker-compose"
        echo -e "  macOS: brew install docker-compose"
        echo -e "  或: pip install docker-compose"
    fi
    
    exit 1
fi
