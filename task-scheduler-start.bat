@echo off
REM ================================================================
REM CV BANYU MAKMUR - Task Scheduler Startup Script
REM ================================================================
REM Untuk dijalankan via Windows Task Scheduler saat startup
REM Created: December 2025
REM ================================================================

title CV Banyu Makmur - Task Scheduler Startup

REM Set working directory ke folder aplikasi
cd /d C:\laragon\www\CV-BANYUMAKMUR

REM Log file untuk debugging
set LOGFILE=%~dp0startup.log
echo [%date% %time%] Starting CV Banyu Makmur Application >> "%LOGFILE%"

REM Delay untuk memastikan Windows sudah siap (30 detik)
echo Waiting for Windows to be ready (30 seconds)...
timeout /t 30 /nobreak >nul

REM Check apakah MySQL/Laragon sudah running
echo Checking MySQL status...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MySQL is running [OK]
    echo [%date% %time%] MySQL is running >> "%LOGFILE%"
) else (
    echo MySQL is not running - Attempting to start Laragon...
    echo [%date% %time%] MySQL not running - Starting Laragon >> "%LOGFILE%"

    REM Start Laragon jika ada
    if exist "C:\laragon\laragon.exe" (
        start "" "C:\laragon\laragon.exe"
        echo Waiting for Laragon to start (20 seconds)...
        timeout /t 20 /nobreak >nul
    ) else (
        echo ERROR: Laragon not found! Please start MySQL manually.
        echo [%date% %time%] ERROR: Laragon not found >> "%LOGFILE%"
        pause
        exit /b 1
    )
)

REM Check apakah Node.js tersedia
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found in PATH!
    echo [%date% %time%] ERROR: Node.js not found >> "%LOGFILE%"
    pause
    exit /b 1
)

REM Check apakah npm tersedia
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: NPM not found in PATH!
    echo [%date% %time%] ERROR: NPM not found >> "%LOGFILE%"
    pause
    exit /b 1
)

REM Start aplikasi menggunakan npm run dev
echo Starting application with npm run dev...
echo [%date% %time%] Starting npm run dev >> "%LOGFILE%"

REM Jalankan npm run dev (backend + frontend concurrently)
start "CV Banyu Makmur - Application" /MIN cmd /c "cd /d C:\laragon\www\CV-BANYUMAKMUR && npm run dev"

REM Tunggu 15 detik untuk backend dan frontend start
echo Waiting for application to start (15 seconds)...
timeout /t 15 /nobreak >nul

REM Buka browser ke aplikasi
echo Opening browser...
start http://localhost:5173

echo [%date% %time%] Application started successfully >> "%LOGFILE%"
echo.
echo Application started successfully!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Check startup.log for details
echo.

REM Script selesai - window akan otomatis close
timeout /t 5 /nobreak >nul
exit
