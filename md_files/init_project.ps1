param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

$SourcePath = "E:\Wordk-- Desktop\=md files All"
$DestinationPath = Join-Path (Get-Location) $ProjectName

# 1. Create Project Folder
if (!(Test-Path $DestinationPath)) {
    New-Item -ItemType Directory -Path $DestinationPath
    Write-Host "✅ Created project folder: $ProjectName" -ForegroundColor Cyan
} else {
    Write-Host "⚠️ Folder $ProjectName already exists!" -ForegroundColor Yellow
}

# 2. Copy all .md files
$MdFiles = Get-ChildItem -Path $SourcePath -Filter *.md
foreach ($File in $MdFiles) {
    Copy-Item -Path $File.FullName -Destination $DestinationPath
}
Write-Host "✅ Copied $($MdFiles.Count) markdown templates to $ProjectName" -ForegroundColor Green

# 3. Initialize Git (Optional but recommended)
Set-Location $DestinationPath
if (!(Test-Path ".git")) {
    git init
    Write-Host "✅ Initialized Git repository" -ForegroundColor Cyan
}

Write-Host "`n🚀 Project '$ProjectName' is ready to go!" -ForegroundColor Cyan
Write-Host "Standard Files: 01-27 (Rules, Backup Script Included)" -ForegroundColor Gray
