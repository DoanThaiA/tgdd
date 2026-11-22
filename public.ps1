# Public website ra Internet qua Cloudflare Quick Tunnel (không cần mở firewall / cấu hình router).
#   Chạy:  powershell -ExecutionPolicy Bypass -File .\public.ps1
# - Nếu web chưa chạy ở cổng 8000, script tự build (web/) và bật `npm run preview` trong một cửa sổ riêng.
# - Link https://....trycloudflare.com in ra màn hình; đổi mỗi lần chạy lại. Nhấn Ctrl+C để tắt public.
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$web = Join-Path $root "web"
$cloudflared = Join-Path $root "tools\cloudflared\cloudflared.exe"

if (-not (Test-Path $cloudflared)) {
    Write-Host "Chưa có cloudflared, đang tải từ GitHub chính thức của Cloudflare..."
    New-Item -ItemType Directory -Force (Split-Path $cloudflared) | Out-Null
    $ProgressPreference = "SilentlyContinue"
    Invoke-WebRequest "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile $cloudflared -UseBasicParsing
    $sig = Get-AuthenticodeSignature $cloudflared
    if ($sig.Status -ne "Valid" -or $sig.SignerCertificate.Subject -notmatch "Cloudflare") {
        Remove-Item $cloudflared -Force
        throw "Chữ ký số của cloudflared.exe không hợp lệ — đã xoá file."
    }
}

$listening = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if (-not $listening) {
    Write-Host "Đang build website (web/)..."
    if (-not (Test-Path (Join-Path $web "node_modules"))) { npm --prefix $web install --no-audit --no-fund }
    npm --prefix $web run build
    Write-Host "Đang khởi động website (vite preview, cổng 8000)..."
    Start-Process -FilePath "npm.cmd" -ArgumentList "--prefix", $web, "run", "preview" -WorkingDirectory $web
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try { if ((Invoke-WebRequest "http://localhost:8000/" -UseBasicParsing -TimeoutSec 5).StatusCode -eq 200) { break } } catch {}
    }
}

Write-Host ""
Write-Host "Đang mở tunnel... Link public là dòng có 'trycloudflare.com' bên dưới." -ForegroundColor Yellow
& $cloudflared tunnel --no-autoupdate --url http://localhost:8000
