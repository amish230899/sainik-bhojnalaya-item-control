$ErrorActionPreference = 'Stop'
Write-Host 'Installing dependencies...'
npm install
Write-Host 'Building Windows installer...'
npm run build
Write-Host ''
Write-Host 'Installer is in the dist folder.'
