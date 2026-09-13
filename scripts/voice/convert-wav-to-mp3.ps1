$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$AudioRoot = Join-Path $Root 'public\audio\voice'

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  throw 'ffmpeg is required. Install ffmpeg and make sure ffmpeg.exe is on PATH.'
}

$wavFiles = Get-ChildItem -Path $AudioRoot -Filter *.wav -Recurse
if (-not $wavFiles) { throw "No WAV files found under $AudioRoot. Run .\scripts\voice\generate-voice-pack.ps1 first." }

foreach ($wav in $wavFiles) {
  $mp3 = [System.IO.Path]::ChangeExtension($wav.FullName, '.mp3')
  Write-Host "Converting $($wav.FullName)"
  & ffmpeg -y -loglevel error -i $wav.FullName -codec:a libmp3lame -q:a 3 $mp3
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed for $($wav.FullName)" }
}

Write-Host 'MP3 voice pack ready.' -ForegroundColor Green
