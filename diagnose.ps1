# ============================================================================
# 智能鑫AI - Docker 开发环境诊断工具 (Windows PowerShell版)
# 用途：一键诊断Docker环境，收集调试信息
# 
# 使用方式：
# .\diagnose.ps1
# 
# 输出：会生成 docker-diagnose.txt 文件，包含所有调试信息
# ============================================================================

Write-Host "=================================="
Write-Host "  Docker 环境诊断工具"
Write-Host "=================================="
Write-Host ""

# 创建输出文件
$outputFile = "docker-diagnose.txt"
$output = @()

function Add-Output {
    param([string]$line)
    Write-Host $line
    $output += $line
}

# ============================================================================
# 1. 系统信息
# ============================================================================

Add-Output "=============== 1. 系统信息 ==============="
Add-Output "操作系统: $([System.Environment]::OSVersion.VersionString)"
Add-Output "PowerShell 版本: $($PSVersionTable.PSVersion)"
Add-Output ""

# ============================================================================
# 2. Docker 信息
# ============================================================================

Add-Output "=============== 2. Docker 信息 ==============="

$dockerVersion = docker --version 2>$null
if ($dockerVersion) {
    Add-Output "Docker: $dockerVersion"
} else {
    Add-Output "❌ Docker 未安装或不可用"
}

$composeVersion = docker-compose --version 2>$null
if ($composeVersion) {
    Add-Output "Docker Compose: $composeVersion"
} else {
    Add-Output "❌ Docker Compose 未安装或不可用"
}

Add-Output ""

# ============================================================================
# 3. Docker 服务状态
# ============================================================================

Add-Output "=============== 3. Docker 服务状态 ==============="

try {
    $info = docker info 2>$null
    if ($info) {
        Add-Output "✅ Docker 守护进程运行中"
        # 提取关键信息
        $info -split "`n" | Where-Object { $_ -match "Containers|Images|Plugins|Server Version" } | ForEach-Object {
            Add-Output $_
        }
    }
}
catch {
    Add-Output "❌ Docker 守护进程未运行"
}

Add-Output ""

# ============================================================================
# 4. 当前容器
# ============================================================================

Add-Output "=============== 4. 当前容器 ==============="

$containers = docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps 2>$null
if ($containers) {
    Add-Output $containers
} else {
    Add-Output "无容器运行或配置文件不存在"
}

Add-Output ""

# ============================================================================
# 5. 镜像列表
# ============================================================================

Add-Output "=============== 5. Docker 镜像 ==============="

$images = docker images | grep zhinengxin 2>$null
if ($images) {
    Add-Output $images
} else {
    Add-Output "❌ 未找到 zhinengxin 镜像"
}

Add-Output ""

# ============================================================================
# 6. 卷列表
# ============================================================================

Add-Output "=============== 6. Docker 卷 ==============="

$volumes = docker volume ls | grep zhinengxin 2>$null
if ($volumes) {
    Add-Output $volumes
} else {
    Add-Output "❌ 未找到 zhinengxin 卷"
}

Add-Output ""

# ============================================================================
# 7. 网络列表
# ============================================================================

Add-Output "=============== 7. Docker 网络 ==============="

$networks = docker network ls | grep zhinengxin 2>$null
if ($networks) {
    Add-Output $networks
} else {
    Add-Output "❌ 未找到 zhinengxin 网络"
}

Add-Output ""

# ============================================================================
# 8. 配置文件验证
# ============================================================================

Add-Output "=============== 8. 配置文件验证 ==============="

if (Test-Path "docker-compose.yml") {
    Add-Output "✅ docker-compose.yml 存在"
} else {
    Add-Output "❌ docker-compose.yml 缺失"
}

if (Test-Path "docker-compose.dev.yml") {
    Add-Output "✅ docker-compose.dev.yml 存在"
} else {
    Add-Output "❌ docker-compose.dev.yml 缺失"
}

if (Test-Path "Dockerfile") {
    Add-Output "✅ Dockerfile 存在"
} else {
    Add-Output "❌ Dockerfile 缺失"
}

Add-Output ""

# ============================================================================
# 9. 配置语法检查
# ============================================================================

Add-Output "=============== 9. Docker Compose 配置检查 ==============="

$configTest = docker-compose -f docker-compose.yml -f docker-compose.dev.yml config 2>&1
if ($LASTEXITCODE -eq 0) {
    Add-Output "✅ 配置文件语法正确"
} else {
    Add-Output "❌ 配置文件有错误："
    Add-Output $configTest
}

Add-Output ""

# ============================================================================
# 10. 容器日志
# ============================================================================

Add-Output "=============== 10. 容器日志（最后20行） ==============="

$logs = docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=20 2>$null
if ($logs) {
    Add-Output $logs
} else {
    Add-Output "无日志或容器未运行"
}

Add-Output ""

# ============================================================================
# 11. 磁盘空间
# ============================================================================

Add-Output "=============== 11. 磁盘空间 ==============="

$drive = Get-PSDrive -Name C | Select-Object Used, Free
$usedGb = [math]::Round(($drive.Used / 1GB), 2)
$freeGb = [math]::Round(($drive.Free / 1GB), 2)
Add-Output "C盘已用: ${usedGb} GB"
Add-Output "C盘可用: ${freeGb} GB"

if ($freeGb -lt 5) {
    Add-Output "⚠️ 警告：磁盘空间不足，Docker构建可能失败"
}

Add-Output ""

# ============================================================================
# 12. 端口检查
# ============================================================================

Add-Output "=============== 12. 关键端口检查 ==============="

$ports = @(5173, 3000, 5432, 6379)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Add-Output "⚠️ 端口 $port 已被占用"
    } else {
        Add-Output "✅ 端口 $port 可用"
    }
}

Add-Output ""

# ============================================================================
# 13. npm 信息（如果在容器内）
# ============================================================================

Add-Output "=============== 13. 容器内 npm 信息 ==============="

try {
    $npmInfo = docker exec zhinengxin-dev npm --version 2>$null
    if ($npmInfo) {
        Add-Output "npm 版本: $npmInfo"
    }
} catch {
    Add-Output "容器未运行或未找到"
}

Add-Output ""

# ============================================================================
# 保存到文件
# ============================================================================

$output | Out-File -FilePath $outputFile -Encoding UTF8
Write-Host "✅ 诊断完成！" -ForegroundColor Green
Write-Host "诊断信息已保存到：$outputFile" -ForegroundColor Green
Write-Host ""
Write-Host "请分享此文件以获得技术支持或问题排查。"
