$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$ProjectFolder = Get-Location
$ProjectName = Split-Path $ProjectFolder -Leaf
$BackupDir = Join-Path $ProjectFolder "backups"
$ZipFile = Join-Path $BackupDir "BACKUP_$($ProjectName)_$Timestamp.zip"

# Create backup directory if it doesn't exist
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

Write-Host "📦 Starting full project backup for $ProjectName..." -ForegroundColor Cyan

# Exclude unnecessary folders like node_modules, .git, etc.
$Excludes = @("node_modules", ".git", "backups", ".next", "dist", "build")

# Create Zip
Compress-Archive -Path "$ProjectFolder\*" -DestinationPath $ZipFile -Force -CompressionLevel Optimal

if (Test-Path $ZipFile) {
    Write-Host "✅ Backup successful! Saved to: $ZipFile" -ForegroundColor Green
} else {
    Write-Host "❌ Backup failed!" -ForegroundColor Red
}
