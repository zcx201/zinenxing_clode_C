# ============================================================================
# 智能鑫AI Docker 快速操作脚本 (PowerShell版)
# 
# 用途：简化常见的Docker操作，提高工作效率
# 
# 使用方式：
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# .\docker-scripts.ps1 build-dev
# .\docker-scripts.ps1 run-prod
# .\docker-scripts.ps1 help
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

param(
    [string]$Command = "",
    [string]$Param1 = ""
)

# 项目名称
$PROJECT_NAME = "zhinengxin-ai"
$DEV_IMAGE = "${PROJECT_NAME}:dev"
$PROD_IMAGE = "${PROJECT_NAME}:latest"

# ============================================================================
# 颜色和格式函数
# ============================================================================

function Write-Header {
    param([string]$Message)
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# ============================================================================
# 构建函数
# ============================================================================

function Build-Dev {
    Write-Header "构建开发镜像"
    
    try {
        Write-Info "使用Dockerfile target: development"
        docker build --target development -t $DEV_IMAGE .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "开发镜像构建完成"
            Write-Info "镜像信息："
            docker images | Select-String $PROJECT_NAME
        } else {
            Write-Error-Custom "开发镜像构建失败"
            exit 1
        }
    } catch {
        Write-Error-Custom "构建出错: $_"
        exit 1
    }
}

function Build-Prod {
    Write-Header "构建生产镜像"
    
    try {
        Write-Info "使用Dockerfile target: production"
        docker build --target production -t $PROD_IMAGE .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "生产镜像构建完成"
            Write-Info "镜像信息："
            docker images | Select-String $PROJECT_NAME
        } else {
            Write-Error-Custom "生产镜像构建失败"
            exit 1
        }
    } catch {
        Write-Error-Custom "构建出错: $_"
        exit 1
    }
}

function Build-Prod-BuildKit {
    Write-Header "使用BuildKit构建生产镜像（更快）"
    
    try {
        Write-Info "启用Docker BuildKit进行加速构建..."
        $env:DOCKER_BUILDKIT = 1
        docker build --target production -t $PROD_IMAGE .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "生产镜像构建完成（使用BuildKit加速）"
        } else {
            Write-Error-Custom "BuildKit构建失败"
            exit 1
        }
    } catch {
        Write-Error-Custom "构建出错: $_"
        exit 1
    }
}

# ============================================================================
# 运行函数
# ============================================================================

function Run-Dev {
    Write-Header "启动开发环境"
    
    # 检查镜像是否存在
    $imageExists = docker image inspect $DEV_IMAGE 2>$null
    if ($null -eq $imageExists) {
        Write-Warning-Custom "开发镜像不存在，正在构建..."
        Build-Dev
    }
    
    Write-Info "启动开发容器（支持热挂载）..."
    Write-Warning-Custom "访问地址: http://localhost:5173"
    Write-Info "按 Ctrl+C 停止容器"
    docker-compose -f docker-compose.yml up zhinengxin-dev
}

function Run-Prod {
    Write-Header "启动生产环境"
    
    # 检查镜像是否存在
    $imageExists = docker image inspect $PROD_IMAGE 2>$null
    if ($null -eq $imageExists) {
        Write-Warning-Custom "生产镜像不存在，正在构建..."
        Build-Prod
    }
    
    Write-Info "启动生产容器（后台运行）..."
    docker-compose -f docker-compose.yml up -d zhinengxin-prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "生产容器已启动"
        Write-Info "访问地址: http://localhost:3000"
        Write-Info "查看日志: .\docker-scripts.ps1 logs zhinengxin-prod"
    }
}

function Run-Both {
    Write-Header "同时启动开发和生产环境"
    
    Write-Info "启动所有服务..."
    Write-Info "- 开发环境: http://localhost:5173"
    Write-Info "- 生产环境: http://localhost:3000"
    docker-compose up
}

# ============================================================================
# 停止和清理
# ============================================================================

function Stop-All {
    Write-Header "停止所有容器"
    
    try {
        docker-compose down
        Write-Success "容器已停止"
    } catch {
        Write-Error-Custom "停止失败: $_"
    }
}

function Clean-All {
    Write-Header "清理容器、镜像和卷"
    
    Write-Warning-Custom "此操作将删除所有相关的容器、镜像和卷"
    Write-Host "继续吗？(y/N): " -NoNewline
    $confirm = Read-Host
    
    if ($confirm -ne "y") {
        Write-Warning-Custom "已取消清理操作"
        return
    }
    
    try {
        Write-Info "正在停止和删除容器..."
        docker-compose down -v
        
        Write-Info "正在删除开发镜像..."
        docker rmi $DEV_IMAGE 2>$null
        
        Write-Info "正在删除生产镜像..."
        docker rmi $PROD_IMAGE 2>$null
        
        Write-Success "清理完成"
    } catch {
        Write-Error-Custom "清理失败: $_"
    }
}

# ============================================================================
# 日志查看
# ============================================================================

function Show-Logs {
    param(
        [string]$Service = "zhinengxin-dev"
    )
    
    Write-Header "查看 $Service 日志"
    Write-Info "按 Ctrl+C 停止查看日志"
    
    docker-compose logs -f $Service
}

# ============================================================================
# 进入容器
# ============================================================================

function Enter-Dev-Shell {
    Write-Header "进入开发容器"
    docker-compose exec zhinengxin-dev sh
}

function Enter-Prod-Shell {
    Write-Header "进入生产容器"
    docker-compose exec zhinengxin-prod sh
}

# ============================================================================
# 镜像扫描
# ============================================================================

function Scan-Image {
    param(
        [string]$Image = $PROD_IMAGE
    )
    
    Write-Header "扫描镜像漏洞（需要Trivy）"
    
    # 检查Trivy是否安装
    $trivyExists = Get-Command trivy -ErrorAction SilentlyContinue
    
    if ($null -eq $trivyExists) {
        Write-Error-Custom "Trivy未安装"
        Write-Info "请访问: https://github.com/aquasecurity/trivy"
        Write-Info "或使用Chocolatey安装: choco install trivy"
        return
    }
    
    Write-Info "扫描镜像: $Image"
    trivy image $Image
}

# ============================================================================
# 信息展示
# ============================================================================

function Show-Images {
    Write-Header "本地镜像信息"
    docker images | Select-String $PROJECT_NAME
}

function Show-Containers {
    Write-Header "运行中的容器"
    docker-compose ps
}

function Show-Stats {
    Write-Header "容器资源使用情况"
    docker stats
}

# ============================================================================
# 帮助函数
# ============================================================================

function Show-Help {
    Write-Host @"
╔════════════════════════════════════════════════════════════════════════════╗
║              智能鑫AI Docker 快速操作脚本 (PowerShell版)                   ║
╚════════════════════════════════════════════════════════════════════════════╝

【使用方式】
  .\docker-scripts.ps1 <命令> [参数]

【构建镜像】
  build-dev              构建开发镜像
  build-prod             构建生产镜像（标准）
  build-prod-fast        构建生产镜像（使用BuildKit加速）

【运行环境】
  run-dev                启动开发环境（带热挂载）
  run-prod               启动生产环境（后台）
  run-both               同时启动两个环境

【操作容器】
  stop                   停止所有容器
  logs [服务名]          查看容器日志（默认：zhinengxin-dev）
  shell-dev              进入开发容器shell
  shell-prod             进入生产容器shell
  ps                     显示容器状态
  stats                  显示容器资源使用

【清理操作】
  clean                  删除容器、镜像和卷（需确认）

【安全检查】
  scan [镜像名]          扫描镜像漏洞（需要Trivy）

【其他命令】
  images                 显示本地镜像
  help                   显示帮助信息

【常见用例】

1. 第一次使用（构建开发镜像）:
   .\docker-scripts.ps1 build-dev

2. 启动开发环境（热挂载）:
   .\docker-scripts.ps1 run-dev

3. 启动生产环境:
   .\docker-scripts.ps1 run-prod

4. 查看开发容器日志:
   .\docker-scripts.ps1 logs zhinengxin-dev

5. 进入生产容器shell:
   .\docker-scripts.ps1 shell-prod

6. 停止所有容器:
   .\docker-scripts.ps1 stop

7. 清理所有容器和镜像:
   .\docker-scripts.ps1 clean

【故障排查】

- 如果提示"脚本执行禁止"，请运行：
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

- 如果Docker命令不可用，请确认：
  docker --version
  docker-compose --version

- 进入开发容器后运行测试:
  docker-compose exec zhinengxin-dev npm run test

【高级用法】

查看完整镜像分层信息:
  docker history $PROJECT_NAME`:latest

查看镜像大小:
  docker images | Select-String $PROJECT_NAME

导出镜像到本地:
  docker save -o zhinengxin-ai.tar zhinengxin-ai:latest

导入镜像:
  docker load -i zhinengxin-ai.tar

【更多帮助】

- 部署指南: 查看 DOCKER_DEPLOYMENT_GUIDE.md
- Dockerfile注释: 查看 Dockerfile
- Docker官方文档: https://docs.docker.com/

"@
}

function Show-Version {
    Write-Host "智能鑫AI Docker脚本 v1.0.0" -ForegroundColor Cyan
}

# ============================================================================
# 主函数
# ============================================================================

function Main {
    if ([string]::IsNullOrEmpty($Command)) {
        Show-Help
        return
    }
    
    switch ($Command.ToLower()) {
        "build-dev" {
            Build-Dev
        }
        "build-prod" {
            Build-Prod
        }
        "build-prod-fast" {
            Build-Prod-BuildKit
        }
        "run-dev" {
            Run-Dev
        }
        "run-prod" {
            Run-Prod
        }
        "run-both" {
            Run-Both
        }
        "stop" {
            Stop-All
        }
        "clean" {
            Clean-All
        }
        "logs" {
            Show-Logs -Service (if ([string]::IsNullOrEmpty($Param1)) { "zhinengxin-dev" } else { $Param1 })
        }
        "shell-dev" {
            Enter-Dev-Shell
        }
        "shell-prod" {
            Enter-Prod-Shell
        }
        "scan" {
            Scan-Image -Image (if ([string]::IsNullOrEmpty($Param1)) { $PROD_IMAGE } else { $Param1 })
        }
        "ps" {
            Show-Containers
        }
        "stats" {
            Show-Stats
        }
        "images" {
            Show-Images
        }
        "version" {
            Show-Version
        }
        "help" {
            Show-Help
        }
        default {
            Write-Error-Custom "未知命令: $Command"
            Write-Host ""
            Show-Help
            exit 1
        }
    }
}

# 执行主函数
Main
