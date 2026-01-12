# ============================================================================
# 智能鑫AI - Docker 开发环境 - 查看日志脚本 (Windows PowerShell版)
# 用途：实时查看容器日志，便于调试
# 
# 使用方式：
# .\view-logs.ps1
# ============================================================================

Write-Host "=================================="
Write-Host "  智能鑫AI 开发环境 - 实时日志"
Write-Host "=================================="
Write-Host ""
Write-Host "按 Ctrl+C 退出日志查看"
Write-Host ""

# 运行docker-compose logs -f 命令
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f zhinengxin-dev
