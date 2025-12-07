# ✅ CHECKLIST DEPLOYMENT - CV BANYU MAKMUR

Panduan step-by-step untuk deploy aplikasi ke PC Client.

---

## 📦 PERSIAPAN SEBELUM DEPLOY

### A. Software di PC Client (Wajib Install)

- [ ] **Node.js LTS** (v20.x atau v22.x)
  - Download: https://nodejs.org/
  - Verifikasi: `node -v` dan `npm -v` di CMD

- [ ] **MySQL Server** (Pilih salah satu):
  - [ ] XAMPP - https://www.apachefriends.org/ (Recommended)
  - [ ] Laragon - https://laragon.org/
  - [ ] MySQL Standalone - https://dev.mysql.com/downloads/mysql/

- [ ] **Browser Modern**
  - Chrome / Firefox / Edge (biasanya sudah ada)

### B. Software Optional (Tidak Wajib)

- [ ] Visual Studio Code - https://code.visualstudio.com/
  - Hanya perlu jika ingin edit code
  - **SKIP jika hanya menjalankan aplikasi**

- [ ] Git - https://git-scm.com/
  - Hanya perlu jika project di Git repository

---

## 📂 LANGKAH 1: COPY PROJECT

### Opsi A: Copy dari USB/Eksternal

- [ ] Copy folder `CV-BANYUMAKMUR` ke lokasi:
  - **Jika pakai Laragon:** `C:\laragon\www\CV-BANYUMAKMUR`
  - **Jika pakai XAMPP:** `C:\xampp\htdocs\CV-BANYUMAKMUR`
  - **Atau lokasi lain:** `C:\Applications\CV-BANYUMAKMUR`

### Opsi B: Extract dari ZIP

- [ ] Extract file ZIP ke lokasi yang diinginkan
- [ ] Pastikan struktur folder benar (ada file `server.js` di root)

### Verifikasi Struktur Folder

```
CV-BANYUMAKMUR/
├── client/              ✓ Ada
├── middleware/          ✓ Ada
├── routes/              ✓ Ada
├── banyu_makmur.sql     ✓ Ada
├── config.env           ✓ Ada
├── server.js            ✓ Ada
├── package.json         ✓ Ada
├── start-app.bat        ✓ Ada
├── stop-app.bat         ✓ Ada
└── setup-autostart.bat  ✓ Ada
```

---

## 🗄️ LANGKAH 2: SETUP DATABASE

### Start MySQL

- [ ] **Jika pakai XAMPP:**
  1. Buka XAMPP Control Panel
  2. Klik tombol **Start** di MySQL
  3. Tunggu sampai status jadi hijau

- [ ] **Jika pakai Laragon:**
  1. Buka aplikasi Laragon
  2. Klik tombol **Start All**
  3. Tunggu sampai semua jadi hijau

### Import Database

- [ ] Buka phpMyAdmin di browser:
  - URL: `http://localhost/phpmyadmin`
  - Username: `root`
  - Password: (kosongkan, atau lihat setup MySQL)

- [ ] Buat database baru:
  1. Klik tab **Databases**
  2. Database name: `banyu_makmur`
  3. Collation: `utf8mb4_general_ci`
  4. Klik **Create**

- [ ] Import file SQL:
  1. Klik database `banyu_makmur` di sidebar kiri
  2. Klik tab **Import**
  3. Klik **Choose File**
  4. Pilih file `banyu_makmur.sql` dari folder project
  5. Scroll ke bawah
  6. Klik **Go**
  7. Tunggu sampai muncul "Import has been successfully finished"

- [ ] Verifikasi import berhasil:
  - Lihat tabel di sidebar kiri
  - Harus ada tabel: users, collectors, collections, employees, dll.

### Konfigurasi Database Connection

- [ ] Buka file `config.env` di folder project
- [ ] Pastikan konfigurasi sesuai:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=           ← Kosongkan jika pakai XAMPP/Laragon default
DB_NAME=banyu_makmur
DB_PORT=3306
PORT=5000
JWT_SECRET=your-secret-key-here
```

- [ ] **Jika MySQL pakai password:** Isi `DB_PASSWORD=password_anda`
- [ ] Save file `config.env`

---

## 🔧 LANGKAH 3: INSTALL DEPENDENCIES

### Install Backend Dependencies

- [ ] Buka **Command Prompt (CMD)** atau **PowerShell**
  - Cara: Tekan `Win + R`, ketik `cmd`, Enter

- [ ] Masuk ke folder project:
  ```cmd
  cd C:\laragon\www\CV-BANYUMAKMUR
  ```
  (Sesuaikan dengan lokasi folder Anda)

- [ ] Install dependencies backend:
  ```cmd
  npm install
  ```
  - Tunggu 2-5 menit (tergantung internet)
  - Harus muncul folder `node_modules` di root

### Install Frontend Dependencies

- [ ] Masuk ke folder client:
  ```cmd
  cd client
  ```

- [ ] Install dependencies frontend:
  ```cmd
  npm install
  ```
  - Tunggu 3-10 menit (download ~200MB)
  - Harus muncul folder `node_modules` di folder client

### Build Frontend

- [ ] Build frontend untuk production:
  ```cmd
  npm run build
  ```
  - Tunggu 30-60 detik
  - Harus muncul folder `dist` di folder client

- [ ] Kembali ke folder root:
  ```cmd
  cd ..
  ```

---

## 🚀 LANGKAH 4: TEST APLIKASI

### Test Manual

- [ ] Dari Command Prompt di folder root, jalankan:
  ```cmd
  npm run dev
  ```

- [ ] Tunggu sampai muncul pesan:
  ```
  [0] Server is running on port 5000
  [1] Local: http://localhost:5173
  ```

- [ ] Buka browser, ketik: `http://localhost:5173`

- [ ] Test login:
  - Username: `admin` (atau lihat di database)
  - Password: `admin123` (atau lihat di database)

- [ ] Jika berhasil login:
  - [ ] Dashboard muncul ✓
  - [ ] Menu bisa diklik ✓
  - [ ] Data bisa diakses ✓

- [ ] Stop aplikasi:
  - Tekan `Ctrl + C` di Command Prompt
  - Atau tutup jendela Command Prompt

---

## 🔄 LANGKAH 5: SETUP AUTO-START (OPTIONAL)

**Agar aplikasi otomatis jalan saat PC nyala.**

### Setup Autostart

- [ ] Buka folder project di Windows Explorer

- [ ] **Klik kanan** pada file `setup-autostart.bat`

- [ ] Pilih **"Run as Administrator"**

- [ ] Ikuti instruksi di layar:
  1. Ketik `Y` untuk konfirmasi
  2. Tunggu sampai setup selesai
  3. Ketik `N` jika tidak ingin test sekarang

### Verifikasi Autostart

- [ ] Buka folder Startup Windows:
  - Tekan `Win + R`
  - Ketik: `shell:startup`
  - Enter

- [ ] Pastikan ada shortcut **"Koperasi Susu"** di folder Startup

### Test Autostart

- [ ] **Restart PC**
- [ ] Login ke Windows
- [ ] Tunggu 10-15 detik
- [ ] Aplikasi harus otomatis jalan
- [ ] Browser harus otomatis buka `http://localhost:5173`

---

## 🌐 LANGKAH 6: AKSES DARI KOMPUTER LAIN (OPTIONAL)

**Jika ingin akses dari komputer lain dalam jaringan yang sama.**

### Cek IP Komputer Server

- [ ] Buka Command Prompt
- [ ] Ketik: `ipconfig`
- [ ] Catat **IPv4 Address**, contoh: `192.168.1.100`

### Setting Firewall

- [ ] Buka **Windows Defender Firewall**
- [ ] Klik **Advanced settings**
- [ ] Klik **Inbound Rules** → **New Rule**
- [ ] Pilih **Port** → Next
- [ ] Pilih **TCP**
- [ ] Specific local ports: `5000,5173` → Next
- [ ] **Allow the connection** → Next
- [ ] Centang semua (Domain, Private, Public) → Next
- [ ] Name: **Koperasi Susu App** → Finish

### Konfigurasi Vite untuk LAN

- [ ] Buka file `client\vite.config.ts`
- [ ] Pastikan ada setting:

```typescript
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Penting! Untuk akses dari IP lain
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

- [ ] Save file
- [ ] Restart aplikasi

### Test dari Komputer Lain

- [ ] Dari komputer lain, buka browser
- [ ] Ketik: `http://192.168.1.100:5173` (ganti dengan IP Anda)
- [ ] Harus bisa akses aplikasi

---

## 📋 VERIFIKASI AKHIR

### Checklist Fungsional

- [ ] ✓ Aplikasi bisa dijalankan dengan `npm run dev`
- [ ] ✓ Aplikasi bisa dijalankan dengan double-click `start-app.bat`
- [ ] ✓ Browser otomatis buka `http://localhost:5173`
- [ ] ✓ Halaman login muncul
- [ ] ✓ Bisa login dengan username/password
- [ ] ✓ Dashboard menampilkan data
- [ ] ✓ Semua menu bisa diakses
- [ ] ✓ Data bisa ditambah/edit/hapus
- [ ] ✓ Aplikasi bisa di-stop dengan `stop-app.bat`
- [ ] ✓ (Optional) Auto-start saat PC nyala sudah aktif
- [ ] ✓ (Optional) Bisa diakses dari komputer lain

### Checklist File

- [ ] ✓ Folder `node_modules` ada di root
- [ ] ✓ Folder `node_modules` ada di client
- [ ] ✓ Folder `dist` ada di client
- [ ] ✓ File `config.env` sudah dikonfigurasi
- [ ] ✓ Database `banyu_makmur` sudah di-import
- [ ] ✓ Shortcut di Startup (jika pakai auto-start)

---

## 🛑 CARA STOP APLIKASI

### Manual

1. Tutup semua jendela Command Prompt yang terbuka
2. Atau tekan `Ctrl + C` di Command Prompt

### Menggunakan Script

1. Double-click file: `stop-app.bat`
2. Tunggu sampai selesai

---

## 📝 CARA DISABLE AUTO-START

Jika tidak ingin aplikasi auto-start lagi:

1. Tekan `Win + R`
2. Ketik: `shell:startup`
3. Enter
4. Hapus shortcut **"Koperasi Susu"**

---

## 🔧 TROUBLESHOOTING CEPAT

| Masalah | Solusi |
|---------|--------|
| **"node is not recognized"** | Install Node.js, restart CMD |
| **"Cannot connect to database"** | Start MySQL di XAMPP/Laragon |
| **"Port already in use"** | Jalankan `stop-app.bat` dulu |
| **Halaman blank/putih** | Cek `npm run build` sudah jalan |
| **npm install error** | Cek koneksi internet, coba lagi |
| **Login gagal** | Cek database sudah di-import |

Untuk troubleshooting lengkap, lihat file: `PANDUAN_INSTALASI_CLIENT.md`

---

## 📞 INFORMASI PENTING

### URL Akses

- **Localhost:** http://localhost:5173
- **LAN:** http://[IP-KOMPUTER]:5173

### Port yang Digunakan

- Backend API: Port **5000**
- Frontend App: Port **5173**
- MySQL: Port **3306**

### File Penting

- `config.env` - Konfigurasi database & server
- `start-app.bat` - Script start aplikasi
- `stop-app.bat` - Script stop aplikasi
- `setup-autostart.bat` - Script setup auto-start

### Backup Database

**PENTING:** Backup database secara rutin!

1. Buka phpMyAdmin
2. Pilih database `banyu_makmur`
3. Klik tab **Export**
4. Klik **Go**
5. Simpan file `.sql`

---

## ✅ DEPLOYMENT SELESAI!

Jika semua checklist di atas sudah ✓, maka deployment berhasil!

**Aplikasi siap digunakan! 🎉**

---

**Dibuat:** Desember 2025
**Versi:** 1.0
**Untuk:** CV Banyu Makmur - Koperasi Susu Management System
