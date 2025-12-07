@echo off
REM ================================================================
REM CV BANYU MAKMUR - Simple Task Scheduler Script
REM ================================================================
REM Versi sederhana - langsung jalankan aplikasi
REM ================================================================

REM Tunggu 30 detik setelah Windows startup
timeout /t 30 /nobreak >nul

REM Pindah ke folder aplikasi
cd /d C:\laragon\www\CV-BANYUMAKMUR

REM Jalankan aplikasi
npm run dev

REM Note: Window akan tetap terbuka untuk melihat log
