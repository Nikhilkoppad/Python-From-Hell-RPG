$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$VoiceDir = Join-Path $Root 'tools\piper\voices'
New-Item -ItemType Directory -Force -Path $VoiceDir | Out-Null

Write-Host 'Python From Hell — local Piper voice setup' -ForegroundColor Cyan
Write-Host 'Installing Piper TTS into a local virtual environment...'

$Venv = Join-Path $Root 'tools\piper\.venv'
if (-not (Test-Path $Venv)) { python -m venv $Venv }
$Py = Join-Path $Venv 'Scripts\python.exe'
& $Py -m pip install --upgrade pip piper-tts

Write-Host 'Downloading English voice...'
Push-Location $VoiceDir
& $Py -m piper.download_voices en_US-lessac-medium --data-dir $VoiceDir
Write-Host 'Downloading Hindi voice...'
& $Py -m piper.download_voices hi_IN-priyamvada-medium --data-dir $VoiceDir
Pop-Location

Write-Host ''
Write-Host 'Voice models ready.' -ForegroundColor Green
Write-Host "Models: $VoiceDir"
