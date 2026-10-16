# ================================================================
# Simple Local HTTP Server - Async, handles concurrent requests
# Uses .NET HttpListener BeginGetContext pattern
# ================================================================

param(
    [int]$Port = 8083,
    [string]$Root = (Split-Path -Parent $MyInvocation.MyCommand.Path)
)

$host.UI.RawUI.WindowTitle = "Dreams Website - Local Server"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Dreams Website - Local Server" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "  Server running at: http://localhost:$Port" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C to stop" -ForegroundColor DarkGray
    Write-Host ""
} catch {
    Write-Host "  ERROR: Cannot start server. Port $Port may be in use." -ForegroundColor Red
    Write-Host "  Try: .\Server.ps1 -Port 9090" -ForegroundColor Yellow
    pause
    exit 1
}

try { Start-Process "http://localhost:$Port/" -ErrorAction Stop } catch {}

# State object passed to callback
$state = @{
    Listener = $listener
    Root = $Root
}

# Async callback handler
$handler = [System.AsyncCallback]{
    param($ar)
    $s = $ar.AsyncState
    $ctx = $s.Listener.EndGetContext($ar)

    # Re-register for next request
    $s.Listener.BeginGetContext($handler, $s) | Out-Null

    $request = $ctx.Request
    $response = $ctx.Response

    $rawPath = $request.Url.LocalPath
    $urlPath = [System.Net.WebUtility]::UrlDecode($rawPath).TrimStart('/')

    if ([string]::IsNullOrEmpty($urlPath)) {
        $urlPath = "index.html"
    }

    $filePath = Join-Path $s.Root $urlPath

    if (-not $filePath.StartsWith($s.Root, [System.StringComparison]::OrdinalIgnoreCase)) {
        $filePath = Join-Path $s.Root "index.html"
    }

    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $response.ContentType = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".svg"  { "image/svg+xml" }
            ".json" { "application/json; charset=utf-8" }
            ".ico"  { "image/x-icon" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".webp" { "image/webp" }
            ".woff" { "font/woff" }
            ".woff2"{ "font/woff2" }
            ".txt"  { "text/plain; charset=utf-8" }
            default { "application/octet-stream" }
        }
        $response.ContentLength64 = $content.Length
        $response.Headers.Add("Cache-Control", "no-cache")
        $response.Headers.Add("Connection", "close")
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("<!DOCTYPE html><html dir=rtl><head><meta charset=UTF-8><title>404</title></head><body style='font-family:sans-serif;text-align:center;padding:50px'><h1>404</h1><p>Page not found</p><a href=/>Back to home</a></body></html>")
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $notFound.Length
        $response.OutputStream.Write($notFound, 0, $notFound.Length)
    }

    $response.Close()
}

# Start the async listener
$listener.BeginGetContext($handler, $state) | Out-Null

Write-Host "  Async listener started. Waiting for requests..." -ForegroundColor DarkGray
Write-Host ""

# Keep alive
while ($listener.IsListening) {
    Start-Sleep -Milliseconds 500
}

$listener.Stop()
$listener.Close()
Write-Host ""
Write-Host "  Server stopped." -ForegroundColor Yellow
