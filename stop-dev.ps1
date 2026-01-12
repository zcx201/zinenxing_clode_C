# ============================================================================
# 智能鑫AI - Docker 开发环境 - 停止脚本 (Windows PowerShell版)
# 用途：停止开发环境容器
# 
# 使用方式：
# .\stop-dev.ps1
# ============================================================================

Write-Host "=================================="
Write-Host "  智能鑫AI 开发环境 - 停止"
Write-Host "=================================="
Write-Host ""

Write-Host "停止容器中..." -ForegroundColor Cyan

docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

Write-Host ""
Write-Host "✅ 容器已停止" -ForegroundColor Green
Write-Host ""

Write-Host "如需删除卷（删除后需要重新安装依赖）："
Write-Host "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v"
Write-Host ""
