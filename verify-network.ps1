# ============================================================================
# Docker 网络修复后的测试脚本
# 用途：验证网络配置已正确修复
# ============================================================================

Write-Host "=================================="
Write-Host "  Docker 网络配置验证"
Write-Host "=================================="
Write-Host ""

Write-Host "检查网络定义..." -ForegroundColor Cyan

# 查看docker-compose.dev.yml中的网络定义
$networkDef = Get-Content docker-compose.dev.yml | Select-String -Pattern "^networks:" -A 5

if ($networkDef) {
    Write-Host "✅ docker-compose.dev.yml 中找到网络定义：" -ForegroundColor Green
    $networkDef | ForEach-Object { Write-Host $_}
} else {
    Write-Host "❌ docker-compose.dev.yml 中未找到网络定义" -ForegroundColor Red
}

Write-Host ""
Write-Host "验证配置文件语法..." -ForegroundColor Cyan

# 验证仅开发配置的语法
$result = docker-compose -f docker-compose.dev.yml config 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ docker-compose.dev.yml 配置有效" -ForegroundColor Green
} else {
    Write-Host "❌ docker-compose.dev.yml 配置有错误" -ForegroundColor Red
    Write-Host $result
    exit 1
}

Write-Host ""
Write-Host "检查服务网络引用..." -ForegroundColor Cyan

# 检查服务是否正确引用网络
$serviceNetworks = docker-compose -f docker-compose.dev.yml config 2>&1 | Select-String -Pattern "zhinengxin-network"

if ($serviceNetworks) {
    Write-Host "✅ 服务正确引用了网络：" -ForegroundColor Green
    $serviceNetworks | ForEach-Object { Write-Host $_ }
} else {
    Write-Host "⚠️ 警告：未找到网络引用" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================="
Write-Host "✅ 网络配置验证完成！" -ForegroundColor Green
Write-Host "=================================="
Write-Host ""

Write-Host "现在可以运行以下命令启动开发环境：" -ForegroundColor Cyan
Write-Host "  .\start-dev.ps1" -ForegroundColor Yellow
Write-Host ""
