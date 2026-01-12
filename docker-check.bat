@echo off
REM ============================================================================
REM Docker 环境检查脚本 (Windows批处理版本)
REM
REM 用途：检查Docker环境是否满足要求
REM 使用：docker-check.bat
REM ============================================================================

chcp 65001 > nul
REM 设置UTF-8编码以支持中文输出

setlocal enabledelayedexpansion
setlocal enableextensions

REM 颜色定义
REM 在Windows批处理中颜色支持受限，使用简单符号代替

set "PASSED=0"
set "FAILED=0"
set "WARNING=0"

echo.
echo ============================================================
echo       智能鑫AI - Docker 环境检查工具
echo ============================================================
echo.

REM ============================================================================
REM 检查 Docker 安装
REM ============================================================================

echo [检查] 必需工具
echo.

docker --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo [✓] Docker: !DOCKER_VERSION!
    set /a PASSED=!PASSED!+1
) else (
    echo [✗] Docker: 未安装
    set /a FAILED=!FAILED!+1
)

docker-compose --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('docker-compose --version') do set COMPOSE_VERSION=%%i
    echo [✓] Docker Compose: !COMPOSE_VERSION!
    set /a PASSED=!PASSED!+1
) else (
    echo [✗] Docker Compose: 未安装
    set /a FAILED=!FAILED!+1
)

echo.

REM ============================================================================
REM 检查 Docker 守护进程
REM ============================================================================

echo [检查] Docker 守护进程
echo.

docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Docker daemon: 运行中
    set /a PASSED=!PASSED!+1
) else (
    echo [✗] Docker daemon: 未运行
    echo      提示: 请启动 Docker Desktop
    set /a FAILED=!FAILED!+1
)

echo.

REM ============================================================================
REM 检查磁盘空间
REM ============================================================================

echo [检查] 系统资源
echo.

for /f "tokens=3" %%a in ('dir /-C %cd% ^| find "bytes free"') do (
    set "BYTES_FREE=%%a"
)

REM 简单的磁盘空间检查（至少需要1GB = 1073741824字节）
if defined BYTES_FREE (
    if %BYTES_FREE% gtr 1073741824 (
        set /a GB_FREE=%BYTES_FREE:~0,-9%
        echo [✓] 磁盘空间: 充足 ^(需要 ≥ 1GB^)
        set /a PASSED=!PASSED!+1
    ) else (
        echo [✗] 磁盘空间: 不足 ^(需要 ≥ 1GB^)
        set /a FAILED=!FAILED!+1
    )
) else (
    echo [~] 磁盘空间: 无法检测
)

echo.

REM ============================================================================
REM 检查项目文件
REM ============================================================================

echo [检查] 项目文件
echo.

if exist "Dockerfile" (
    for %%F in (Dockerfile) do set SIZE=%%~zF
    echo [✓] Dockerfile: 存在 ^(!SIZE! bytes^)
    set /a PASSED=!PASSED!+1
) else (
    echo [✗] Dockerfile: 文件不存在
    set /a FAILED=!FAILED!+1
)

if exist ".dockerignore" (
    for %%F in (.dockerignore) do set SIZE=%%~zF
    echo [✓] .dockerignore: 存在 ^(!SIZE! bytes^)
    set /a PASSED=!PASSED!+1
) else (
    echo [✗] .dockerignore: 文件不存在
    set /a FAILED=!FAILED!+1
)

if exist "docker-compose.yml" (
    for %%F in (docker-compose.yml) do set SIZE=%%~zF
    echo [✓] docker-compose.yml: 存在 ^(!SIZE! bytes^)
    set /a PASSED=!PASSED!+1
) else (
    echo [✗] docker-compose.yml: 文件不存在
    set /a FAILED=!FAILED!+1
)

if exist "package.json" (
    for %%F in (package.json) do set SIZE=%%~zF
    echo [✓] package.json: 存在 ^(!SIZE! bytes^)
    set /a PASSED=!PASSED!+1
) else (
    echo [✗] package.json: 文件不存在
    set /a FAILED=!FAILED!+1
)

echo.

REM ============================================================================
REM 检查可选工具
REM ============================================================================

echo [检查] 可选工具
echo.

trivy --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Trivy ^(镜像扫描^): 已安装
    set /a PASSED=!PASSED!+1
) else (
    echo [~] Trivy ^(镜像扫描^): 未安装 ^(可选^)
    set /a WARNING=!WARNING!+1
)

git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Git: 已安装
    set /a PASSED=!PASSED!+1
) else (
    echo [~] Git: 未安装 ^(可选^)
    set /a WARNING=!WARNING!+1
)

echo.

REM ============================================================================
REM Docker 额外检查
REM ============================================================================

echo [检查] Docker 功能
echo.

for /f %%a in ('docker images --quiet 2^>nul ^| find /c /v ""') do set IMAGE_COUNT=%%a
if not "!IMAGE_COUNT!"=="" (
    echo [✓] Docker镜像: !IMAGE_COUNT! 个本地镜像
) else (
    echo [✗] 无法列出Docker镜像
)

for /f %%a in ('docker volume ls --quiet 2^>nul ^| find /c /v ""') do set VOLUME_COUNT=%%a
if not "!VOLUME_COUNT!"=="" (
    echo [✓] Docker卷: !VOLUME_COUNT! 个本地卷
) else (
    echo [~] 无法列出Docker卷
)

echo.

REM ============================================================================
REM 总结
REM ============================================================================

echo ============================================================
echo [结果] 检查完成
echo ============================================================
echo 通过: !PASSED! ^| 失败: !FAILED! ^| 警告: !WARNING!
echo.

if %FAILED% equ 0 (
    echo [✓] 环境检查成功！所有必需条件都满足。
    echo.
    echo 下一步，你可以运行:
    echo   docker-compose up zhinengxin-dev     REM 启动开发环境
    echo   docker-compose up zhinengxin-prod    REM 启动生产环境
    echo.
    echo 或使用PowerShell脚本:
    echo   .\docker-scripts.ps1 run-dev
    echo   .\docker-scripts.ps1 run-prod
    echo.
    exit /b 0
) else (
    echo [✗] 环境检查失败！请修复上述问题后重试。
    echo.
    echo 如何安装Docker:
    echo   Windows: 下载 Docker Desktop
    echo            https://www.docker.com/products/docker-desktop
    echo.
    echo   安装后，请确保Docker Desktop正在运行
    echo.
    exit /b 1
)

endlocal
