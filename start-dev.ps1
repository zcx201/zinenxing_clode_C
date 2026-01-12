# ============================================================================
# 智能鑫AI - Docker 开发环境启动脚本 (Windows PowerShell版)
# 用途：一键启动开发环境，自动处理常见问题
# 
# 使用方式：
# .\start-dev.ps1
# 
# 如果遇到"无法加载脚本"错误，运行：
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# ============================================================================

# 颜色输出函数
function Write-Info {
    Write-Host "[INFO] $args" -ForegroundColor Cyan
}

function Write-Success {
    Write-Host "[SUCCESS] $args" -ForegroundColor Green
}

function Write-Warning {
    Write-Host "[WARNING] $args" -ForegroundColor Yellow
}

function Write-Error-Custom {
    Write-Host "[ERROR] $args" -ForegroundColor Red
}

# ============================================================================
# 步骤1：检查环境
# ============================================================================

Write-Info "检查Docker环境..."

$dockerExists = $null -ne (Get-Command docker -ErrorAction SilentlyContinue)
if (-not $dockerExists) {
    Write-Error-Custom "Docker未安装。请先安装Docker Desktop for Windows。"
    exit 1
}

$composeExists = $null -ne (Get-Command docker-compose -ErrorAction SilentlyContinue)
if (-not $composeExists) {
    Write-Error-Custom "Docker Compose未安装。请先安装Docker Desktop for Windows。"
    exit 1
}

$dockerVersion = docker --version
$composeVersion = docker-compose --version

Write-Success "Docker已安装：$dockerVersion"
Write-Success "Docker Compose已安装：$composeVersion"

# ============================================================================
# 步骤2：检查旧的容器（可选清理）
# ============================================================================

Write-Info "检查是否存在旧的容器和卷..."

try {
    $existingContainers = docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps 2>$null
    if ($existingContainers -match "zhinengxin-dev") {
        Write-Warning "发现已存在的开发环境。"
        $response = Read-Host "是否清理旧的容器? (y/n)"
        if ($response -eq "y" -or $response -eq "Y") {
            Write-Info "停止并删除旧容器..."
            docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
            Write-Success "旧容器已清理"
        }
    }
}
catch {
    # 可能不存在容器，继续
}

# ============================================================================
# 步骤3：验证配置文件
# ============================================================================

Write-Info "验证Docker配置文件..."

if (-not (Test-Path "docker-compose.yml")) {
    Write-Error-Custom "找不到 docker-compose.yml"
    exit 1
}

if (-not (Test-Path "docker-compose.dev.yml")) {
    Write-Error-Custom "找不到 docker-compose.dev.yml"
    exit 1
}

if (-not (Test-Path "Dockerfile")) {
    Write-Error-Custom "找不到 Dockerfile"
    exit 1
}

Write-Success "所有配置文件都存在"

# ============================================================================
# 步骤4：验证Docker Compose配置语法
# ============================================================================

Write-Info "验证Docker Compose配置语法..."

$configValid = $false
try {
    $output = docker-compose -f docker-compose.yml -f docker-compose.dev.yml config 2>&1
    if ($LASTEXITCODE -eq 0) {
        $configValid = $true
    }
}
catch {
    $configValid = $false
}

if (-not $configValid) {
    Write-Error-Custom "Docker Compose配置有错误"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml config
    exit 1
}

Write-Success "Docker Compose配置正确"

# ============================================================================
# 步骤5：构建镜像
# ============================================================================

Write-Info "构建Docker镜像（这可能需要2-5分钟）..."
Write-Info "这个过程中会下载依赖，请耐心等待..."

$buildSuccess = $false
try {
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
    if ($LASTEXITCODE -eq 0) {
        $buildSuccess = $true
    }
}
catch {
    $buildSuccess = $false
}

if (-not $buildSuccess) {
    Write-Error-Custom "镜像构建失败"
    Write-Info "查看上面的错误信息并参考 DOCKER_DEV_TROUBLESHOOTING.md"
    exit 1
}

Write-Success "镜像构建成功"

# ============================================================================
# 步骤6：启动容器
# ============================================================================

Write-Info "启动开发环境容器..."

$upSuccess = $false
try {
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    if ($LASTEXITCODE -eq 0) {
        $upSuccess = $true
    }
}
catch {
    $upSuccess = $false
}

if (-not $upSuccess) {
    Write-Error-Custom "容器启动失败"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs
    exit 1
}

Write-Success "容器已启动"

# ============================================================================
# 步骤7：等待容器健康
# ============================================================================

Write-Info "等待容器完全启动（这需要10-30秒）..."

$maxAttempts = 30
$attempt = 0
$isHealthy = $false

while ($attempt -lt $maxAttempts) {
    try {
        $psOutput = docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps zhinengxin-dev 2>$null
        
        if ($psOutput -match "healthy") {
            Write-Success "容器已完全启动并健康"
            $isHealthy = $true
            break
        }
        elseif ($psOutput -match "starting") {
            Write-Info "容器正在启动... ($attempt/$maxAttempts)"
            Start-Sleep -Seconds 1
        }
        elseif ($psOutput -match "Up") {
            Write-Info "容器已启动，等待健康检查... ($attempt/$maxAttempts)"
            Start-Sleep -Seconds 1
        }
        else {
            Write-Info "容器状态检查中... ($attempt/$maxAttempts)"
            Start-Sleep -Seconds 1
        }
    }
    catch {
        Write-Info "等待中... ($attempt/$maxAttempts)"
        Start-Sleep -Seconds 1
    }
    
    $attempt++
}

if (-not $isHealthy -and $attempt -ge $maxAttempts) {
    Write-Warning "容器启动超时，但可能仍在初始化中"
    Write-Info "查看日志："
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs zhinengxin-dev
}

# ============================================================================
# 步骤8：显示信息和说明
# ============================================================================

Write-Host ""
Write-Success "=================================="
Write-Success "✅ 开发环境启动成功！"
Write-Success "=================================="
Write-Host ""

Write-Info "访问地址："
Write-Host "  🌐 前端应用:  http://localhost:5173"
Write-Host "  📝 日志命令:  docker-compose logs -f zhinengxin-dev"
Write-Host "  🛑 停止容器:  docker-compose -f docker-compose.yml -f docker-compose.dev.yml down"
Write-Host ""

Write-Info "常用命令："
Write-Host "  查看实时日志:     .\view-logs.ps1"
Write-Host "  停止容器:         .\stop-dev.ps1"
Write-Host "  进入容器shell:    docker exec -it zhinengxin-dev sh"
Write-Host ""

Write-Info "进一步了解："
Write-Host "  快速参考:         DOCKER_QUICK_REFERENCE.md"
Write-Host "  完整教程:         DOCKER_PRODUCTION_GUIDE.md"
Write-Host "  故障排查:         DOCKER_DEV_TROUBLESHOOTING.md"
Write-Host ""

# ============================================================================
# 步骤9：自动打开浏览器
# ============================================================================

Write-Info "尝试打开浏览器..."

try {
    Start-Process "http://localhost:5173"
    Write-Success "浏览器已打开"
}
catch {
    Write-Info "请手动在浏览器中打开 http://localhost:5173"
}

Write-Success "完成！"
