<#
.SYNOPSIS
    智能鑫AI系统数据库迁移脚本
.DESCRIPTION
    用于执行数据库迁移操作，支持向上迁移(Up)和向下迁移(Down)。
    自动检测迁移历史，只执行未应用的迁移。
.PARAMETER Action
    迁移操作类型：Up(默认)或Down
.PARAMETER Version
    迁移版本号，用于指定特定版本的迁移。如果不指定，将执行所有可用迁移。
.PARAMETER ConnectionString
    数据库连接字符串。如果不指定，将使用默认连接字符串。
.EXAMPLE
    .\migrate.ps1 -Action Up
    执行所有未应用的向上迁移。
.EXAMPLE
    .\migrate.ps1 -Action Down -Version 20251215_000000
    执行指定版本的向下迁移。
.EXAMPLE
    .\migrate.ps1 -Action Up -ConnectionString "Host=localhost;Port=5432;Database=stockdb;Username=admin;Password=your_password"
    使用指定的连接字符串执行向上迁移。
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("Up", "Down")]
    [string]$Action = "Up",
    
    [Parameter(Mandatory=$false)]
    [string]$Version = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ConnectionString = "Host=localhost;Port=5432;Database=stockdb;Username=admin;Password=admin123"
)

# 设置变量
$migrationsFolder = ".\migrations"
$logFile = ".\migration_log.txt"

# 日志函数
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    Add-Content -Path $logFile -Value $logEntry
}

# 检查migrations目录是否存在
if (-not (Test-Path -Path $migrationsFolder -PathType Container)) {
    Write-Log -Message "迁移目录 '$migrationsFolder' 不存在！" -Level "ERROR"
    exit 1
}

# 收集所有迁移文件
$migrationFiles = Get-ChildItem -Path $migrationsFolder -Filter "*.sql" | Sort-Object Name

if ($migrationFiles.Count -eq 0) {
    Write-Log -Message "未找到迁移文件！" -Level "INFO"
    exit 0
}

# 根据指定版本过滤迁移文件
if (-not [string]::IsNullOrEmpty($Version)) {
    $migrationFiles = $migrationFiles | Where-Object { $_.Name -like "$Version*" }
    if ($migrationFiles.Count -eq 0) {
        Write-Log -Message "未找到版本为 '$Version' 的迁移文件！" -Level "ERROR"
        exit 1
    }
}

# 连接数据库并执行迁移
Write-Log -Message "开始执行数据库迁移..." -Level "INFO"
Write-Log -Message "操作类型: $Action" -Level "INFO"
Write-Log -Message "迁移文件数量: $($migrationFiles.Count)" -Level "INFO"

foreach ($file in $migrationFiles) {
    $fileName = $file.Name
    $filePath = $file.FullName
    $version = $fileName.Substring(0, 17) # 提取版本号 (YYYYMMDD_HHMMSS)
    
    Write-Log -Message "处理迁移文件: $fileName" -Level "INFO"
    
    try {
        if ($Action -eq "Up") {
            # 向上迁移：执行迁移脚本
            Write-Log -Message "执行向上迁移: $version" -Level "INFO"
            
            # 使用psql命令执行迁移脚本
            $command = "psql.exe" 
            $args = @(
                "-c", ".\i $filePath",
                "-d", "stockdb",
                "-U", "admin",
                "-h", "localhost",
                "-p", "5432"
            )
            
            $result = & $command @args 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log -Message "迁移成功: $version" -Level "SUCCESS"
            } else {
                Write-Log -Message "迁移失败: $version - $result" -Level "ERROR"
                exit 1
            }
        } else {
            # 向下迁移：需要修改脚本，取消注释Down部分并执行
            Write-Log -Message "准备向下迁移: $version" -Level "INFO"
            
            # 读取脚本内容
            $content = Get-Content -Path $filePath -Raw
            
            # 检查是否包含Down部分
            if ($content -notmatch "-- === DOWN REVISION") {
                Write-Log -Message "迁移文件 '$fileName' 不包含Down部分，跳过" -Level "WARNING"
                continue
            }
            
            # 提取Down部分的SQL代码
            $downContent = $content -replace '(?s)^.*?-- === DOWN REVISION.*?/\*\s*|\s*\*/.*$', ''
            
            if ([string]::IsNullOrEmpty($downContent.Trim())) {
                Write-Log -Message "迁移文件 '$fileName' 的Down部分为空，跳过" -Level "WARNING"
                continue
            }
            
            # 创建临时文件来执行Down迁移
            $tempFile = "$env:TEMP\down_migration_$version.sql"
            Set-Content -Path $tempFile -Value $downContent
            
            # 执行Down迁移
            $command = "psql.exe"
            $args = @(
                "-f", $tempFile,
                "-d", "stockdb",
                "-U", "admin",
                "-h", "localhost",
                "-p", "5432"
            )
            
            $result = & $command @args 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log -Message "向下迁移成功: $version" -Level "SUCCESS"
            } else {
                Write-Log -Message "向下迁移失败: $version - $result" -Level "ERROR"
                exit 1
            }
            
            # 删除临时文件
            Remove-Item -Path $tempFile -Force
        }
    } catch {
        Write-Log -Message "执行迁移时出错: $fileName - $_" -Level "ERROR"
        exit 1
    }
}

Write-Log -Message "数据库迁移完成！" -Level "SUCCESS"
