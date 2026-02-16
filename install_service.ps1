<#
.SYNOPSIS
    Installs Dockium as a Windows Service.
    REQUIRED: Run this script as Administrator.
#>

$ServiceName = "Dockium"
$Description = "Dockium Infrastructure Management Service"
$AppDir = "d:\Manjoor\Code\Dockium\release"
$ExePath = "$AppDir\dockium-backend.exe"

# check for Admin
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "This script MUST be run as an Administrator."
    exit 1
}

# 1. Create the Service
Write-Host "Creating $ServiceName service..." -ForegroundColor Cyan
New-Service -Name $ServiceName `
            -BinaryPathName $ExePath `
            -Description $Description `
            -DisplayName "Dockium Service" `
            -StartupType Automatic

# 2. Configure Service to restart on failure
Write-Host "Configuring recovery options..." -ForegroundColor Cyan
& sc.exe failure $ServiceName reset= 86400 actions= restart/60000/restart/60000/restart/60000

# 3. Start the Service
Write-Host "Starting $ServiceName..." -ForegroundColor Cyan
Start-Service -Name $ServiceName

Write-Host "`nService $ServiceName is now running as a system daemon." -ForegroundColor Green
Write-Host "You can manage it using: Start-Service $ServiceName / Stop-Service $ServiceName" -ForegroundColor Yellow
