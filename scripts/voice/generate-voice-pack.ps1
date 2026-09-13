$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$VenvPy = Join-Path $Root 'tools\piper\.venv\Scripts\python.exe'
$VoiceDir = Join-Path $Root 'tools\piper\voices'
$OutDir = Join-Path $Root 'public\audio\voice'
$Manifest = Join-Path $Root 'scripts\voice\voice-lines.json'

if (-not (Test-Path $VenvPy)) { throw 'Piper is not installed. Run: .\scripts\voice\download-piper-voices.ps1' }
if (-not (Test-Path $Manifest)) { throw "Missing voice manifest: $Manifest" }

$lines = Get-Content $Manifest -Raw | ConvertFrom-Json
foreach ($line in $lines) {
  $actorDir = Join-Path $OutDir "$($line.language)\$($line.actor)"
  New-Item -ItemType Directory -Force -Path $actorDir | Out-Null
  $target = Join-Path $actorDir "$($line.id).wav"
  $model = if ($line.language -eq 'hinglish') { 'hi_IN-priyamvada-medium' } else { 'en_US-lessac-medium' }
  Write-Host "Generating [$($line.language)] $($line.actor)/$($line.id)"
  & $VenvPy -m piper -m $model --data-dir $VoiceDir -f $target -- $line.text
}

Write-Host ''
Write-Host 'Voice pack generated as WAV files.' -ForegroundColor Green
Write-Host 'Browser playback currently expects MP3. Convert the generated WAV files to MP3 with ffmpeg, preserving the same folders and filenames.' -ForegroundColor Yellow
