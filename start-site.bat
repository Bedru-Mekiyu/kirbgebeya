@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo   Starting Kirb Gebeya eCommerce Platform
echo ===================================================

echo [1/3] Ensuring MariaDB database is running in WSL...
wsl -d Ubuntu-20.04 -u root service mysql start >nul 2>&1
start /b wsl -d Ubuntu-20.04 sleep infinity >nul 2>&1

echo [2/3] Checking database IP and network bridge...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $wslIp = (wsl -d Ubuntu-20.04 hostname -I).Trim().Split(' ')[0]; if ($wslIp) { $envFile = 'public_html\.env'; $content = Get-Content $envFile; $newContent = $content -replace '^DB_HOST=.*', ('DB_HOST=' + $wslIp); Set-Content $envFile $newContent; Write-Host ('  WSL Database Host: ' + $wslIp) } }"

echo [3/3] Launching web server at http://127.0.0.1:8001...
echo.
echo Application URLs:
echo   - Home Page:        http://127.0.0.1:8001
echo   - Admin Panel:      http://127.0.0.1:8001/admin (or /login)
echo     Admin Email:      admin@example.com
echo     Admin Password:   123456
echo   - Seller Login:     seller@example.com / 123456
echo   - Customer Login:   customer@example.com / 123456
echo.
echo Press Ctrl+C in this terminal to stop the server.
echo.

cd public_html
php -d error_reporting="E_ALL & ~E_DEPRECATED" artisan serve --host=127.0.0.1 --port=8001 --no-reload
