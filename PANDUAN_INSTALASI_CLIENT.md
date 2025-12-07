# PANDUAN INSTALASI KOPERASI SUSU - UNTUK CLIENT

## Prasyarat yang Harus Diinstal di Komputer Client

1. **Laragon** (sudah termasuk MySQL, PHP, Apache)
   - Download dari: https://laragon.org/download/
   - Install dengan pengaturan default

2. **Node.js** (versi 18 atau lebih baru)
   - Download dari: https://nodejs.org/
   - Pilih versi LTS (Long Term Support)
   - Install dengan pengaturan default

## LANGKAH-LANGKAH INSTALASI

### LANGKAH 1: Persiapan Folder Aplikasi

1. Buka Laragon
2. Copy seluruh folder `banyumakmurtikitaka` ke `C:\laragon\www\`
3. Struktur folder akhir: `C:\laragon\www\banyumakmurtikitaka\`

### LANGKAH 2: Import Database

1. **Start Laragon**
   - Buka aplikasi Laragon
   - Klik tombol "Start All"
   - Tunggu hingga MySQL dan Apache berjalan (lampu hijau)

2. **Buka phpMyAdmin**
   - Klik menu "Database" di Laragon
   - Pilih "phpMyAdmin" atau buka browser: http://localhost/phpmyadmin
   - Username: `root`
   - Password: (kosongkan)

3. **Buat Database Baru**
   - Klik tab "Databases"
   - Nama database: `banyu_makmur`
   - Collation: `utf8mb4_general_ci`
   - Klik "Create"

4. **Import File SQL**
   - Klik database `banyu_makmur` yang baru dibuat
   - Klik tab "Import"
   - Klik "Choose File"
   - Pilih file `banyu_makmur.sql` dari folder aplikasi
   - Scroll ke bawah, klik "Go"
   - Tunggu hingga muncul pesan "Import has been successfully finished"

### LANGKAH 3: Konfigurasi Backend (Server)

1. **Install Dependencies Backend**
   - Buka Command Prompt (CMD) atau PowerShell
   - Masuk ke folder aplikasi:
     ```
     cd C:\laragon\www\banyumakmurtikitaka
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Tunggu hingga selesai (beberapa menit)

2. **Konfigurasi Environment**
   - File `config.env` sudah tersedia di folder utama
   - Pastikan konfigurasi database sudah benar:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=banyu_makmur
     DB_PORT=3306
     PORT=5000
     ```

### LANGKAH 4: Konfigurasi Frontend (Client)

1. **Install Dependencies Frontend**
   - Di Command Prompt yang sama, masuk ke folder client:
     ```
     cd client
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Tunggu hingga selesai (beberapa menit)

2. **Build Frontend untuk Production**
   - Jalankan perintah build:
     ```
     npm run build
     ```
   - Tunggu hingga selesai
   - Folder `dist` akan dibuat otomatis

### LANGKAH 5: Setup Auto-Start (Agar Otomatis Jalan)

1. **Jalankan Script Setup**
   - Kembali ke folder utama:
     ```
     cd ..
     ```
   - Jalankan script setup:
     ```
     setup-autostart.bat
     ```
   - Ikuti instruksi yang muncul

2. **Verifikasi Auto-Start**
   - Script akan membuat shortcut di folder Startup Windows
   - Aplikasi akan otomatis jalan saat komputer dinyalakan
   - Lokasi shortcut: `C:\Users\[NamaUser]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\`

### LANGKAH 6: Menjalankan Aplikasi Pertama Kali

1. **Manual Start (untuk testing)**
   - Double-click file: `start-app.bat`
   - Tunggu hingga 2 jendela command prompt muncul:
     - Jendela 1: Backend Server (port 5000)
     - Jendela 2: Frontend Server (port 5173)

2. **Akses Aplikasi**
   - Buka browser (Chrome/Firefox/Edge)
   - Ketik alamat: **http://localhost:5173**
   - Login dengan:
     - Username: `admin`
     - Password: `admin123`

## ALAMAT AKSES UNTUK CLIENT

### Di Komputer yang Sama (Localhost)
```
http://localhost:5173
```

### Dari Komputer Lain di Jaringan yang Sama (LAN)
```
http://[IP-KOMPUTER-SERVER]:5173
```

**Cara Cek IP Komputer Server:**
1. Buka Command Prompt
2. Ketik: `ipconfig`
3. Lihat "IPv4 Address" di bagian "Wireless LAN adapter Wi-Fi" atau "Ethernet adapter"
4. Contoh IP: `192.168.1.100`
5. Maka alamat aksesnya: `http://192.168.1.100:5173`

**CATATAN PENTING untuk Akses dari Komputer Lain:**
- Pastikan komputer server dan client terhubung dalam jaringan yang sama (WiFi/LAN)
- Matikan Windows Firewall atau buat exception untuk port 5000 dan 5173
- Cara buat exception firewall dijelaskan di bagian "TROUBLESHOOTING"

## MENGHENTIKAN APLIKASI

1. **Manual Stop**
   - Tutup kedua jendela Command Prompt yang terbuka
   - Atau tekan `Ctrl + C` di kedua jendela

2. **Menggunakan Script**
   - Double-click file: `stop-app.bat`

## AUTO-START SAAT KOMPUTER DINYALAKAN

Setelah setup auto-start, aplikasi akan:
1. Otomatis start saat komputer dinyalakan
2. Menunggu 10 detik setelah login
3. Membuka backend dan frontend secara otomatis
4. Browser akan otomatis membuka halaman login

**Menonaktifkan Auto-Start:**
- Hapus shortcut "Koperasi Susu" dari folder Startup
- Lokasi: `C:\Users\[NamaUser]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\`

## STRUKTUR FILE PENTING

```
banyumakmurtikitaka/
├── banyu_makmur.sql          ← File database untuk import
├── config.env                 ← Konfigurasi database & server
├── package.json               ← Dependencies backend
├── server.js                  ← Server utama
├── start-app.bat              ← Script untuk start manual
├── stop-app.bat               ← Script untuk stop aplikasi
├── setup-autostart.bat        ← Script setup auto-start
├── client/
│   ├── dist/                  ← Hasil build (setelah npm run build)
│   ├── package.json           ← Dependencies frontend
│   └── src/                   ← Source code frontend
└── routes/                    ← API routes backend
```

## TROUBLESHOOTING

### 1. Database Connection Error
**Masalah:** Error "Cannot connect to database"
**Solusi:**
- Pastikan Laragon/MySQL sudah running
- Cek konfigurasi di `config.env`
- Pastikan database `banyu_makmur` sudah dibuat dan diimport

### 2. Port Already in Use
**Masalah:** Error "Port 5000 or 5173 already in use"
**Solusi:**
- Buka Task Manager (Ctrl + Shift + Esc)
- Cari process "node.exe", klik End Task
- Atau restart komputer

### 3. npm install Gagal
**Masalah:** Error saat `npm install`
**Solusi:**
- Pastikan koneksi internet stabil
- Hapus folder `node_modules` dan file `package-lock.json`
- Jalankan `npm install` lagi
- Jika masih error, jalankan: `npm cache clean --force` lalu `npm install`

### 4. Tidak Bisa Diakses dari Komputer Lain
**Masalah:** Komputer lain tidak bisa akses http://[IP]:5173
**Solusi:**

**A. Buat Exception di Windows Firewall:**
1. Buka "Windows Defender Firewall"
2. Klik "Advanced settings"
3. Klik "Inbound Rules" → "New Rule"
4. Pilih "Port" → Next
5. Pilih "TCP", isi "Specific local ports": `5000,5173` → Next
6. Pilih "Allow the connection" → Next
7. Centang semua (Domain, Private, Public) → Next
8. Nama: "Koperasi Susu App" → Finish
9. Ulangi untuk "Outbound Rules"

**B. Update Konfigurasi Vite (untuk akses LAN):**
1. Buka file `client\vite.config.ts`
2. Pastikan ada konfigurasi:
   ```typescript
   server: {
     host: '0.0.0.0',  // Membolehkan akses dari IP lain
     port: 5173
   }
   ```

### 5. Auto-Start Tidak Jalan
**Masalah:** Aplikasi tidak otomatis start saat komputer dinyalakan
**Solusi:**
- Cek shortcut di folder Startup
- Jalankan ulang `setup-autostart.bat`
- Pastikan file `start-app.bat` ada di folder aplikasi

### 6. Halaman Putih / Blank Screen
**Masalah:** Browser menampilkan halaman kosong
**Solusi:**
- Pastikan frontend sudah di-build: `npm run build` di folder client
- Clear browser cache (Ctrl + Shift + Delete)
- Coba browser lain
- Cek console browser (F12) untuk error

## MAINTENANCE & UPDATE

### Backup Database
```bash
# Buka phpMyAdmin
# Pilih database banyu_makmur
# Klik "Export"
# Klik "Go"
# Simpan file .sql
```

### Update Aplikasi
1. Stop aplikasi terlebih dahulu
2. Backup database
3. Replace file-file aplikasi dengan versi baru
4. Jalankan `npm install` di folder utama dan client
5. Build ulang frontend: `npm run build` di folder client
6. Start aplikasi kembali

## KONTAK SUPPORT

Jika mengalami masalah, hubungi:
- Developer: [Nama Developer]
- Email: [Email Support]
- Phone: [Nomor Telepon]

---

**Dibuat pada:** November 2025
**Versi Aplikasi:** 1.0.0
**Sistem Operasi:** Windows 10/11 dengan Laragon
