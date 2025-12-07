# 📅 SETUP WINDOWS TASK SCHEDULER

Panduan lengkap untuk setup aplikasi CV Banyu Makmur agar otomatis jalan saat Windows startup menggunakan **Task Scheduler**.

---

## 🎯 Pilihan Setup

Ada 2 cara setup auto-start:

### Cara 1: Menggunakan Startup Folder (Sederhana)
✅ **Recommended untuk user biasa**
- Lebih mudah
- Tidak perlu administrator
- Sudah tersedia: `setup-autostart.bat`

### Cara 2: Menggunakan Task Scheduler (Advanced)
✅ **Recommended untuk production/server**
- Lebih reliable
- Bisa delay startup
- Bisa set prioritas
- Bisa running as administrator
- **Panduan ini untuk Cara 2**

---

## 📋 File Batch yang Tersedia

### 1. `task-scheduler-simple.bat` (Sederhana)
```batch
Fungsi:
- Tunggu 30 detik setelah startup
- Jalankan npm run dev
- Window tetap terbuka (bisa lihat log)

Cocok untuk:
- Testing
- Development
- User yang ingin lihat log
```

### 2. `task-scheduler-start.bat` (Lengkap)
```batch
Fungsi:
- Tunggu 30 detik setelah startup
- Check MySQL/Laragon running
- Auto-start Laragon jika belum jalan
- Check Node.js & NPM
- Jalankan npm run dev
- Auto buka browser
- Logging ke startup.log

Cocok untuk:
- Production
- Client deployment
- Auto-recovery jika MySQL belum jalan
```

**RECOMMENDED: Gunakan `task-scheduler-start.bat`**

---

## 🚀 CARA SETUP TASK SCHEDULER

### METODE A: Setup Manual (Step by Step)

#### Step 1: Buka Task Scheduler

1. Tekan `Win + R`
2. Ketik: `taskschd.msc`
3. Tekan Enter

Atau:
- Cari "Task Scheduler" di Windows Search
- Klik "Task Scheduler"

#### Step 2: Create Basic Task

1. Di Task Scheduler, klik **Action** → **Create Basic Task**

2. **Name & Description:**
   - Name: `CV Banyu Makmur Startup`
   - Description: `Auto-start aplikasi CV Banyu Makmur saat Windows startup`
   - Klik **Next**

#### Step 3: Set Trigger

1. **Trigger:** Pilih **When I log on**
2. Klik **Next**

#### Step 4: Set Action

1. **Action:** Pilih **Start a program**
2. Klik **Next**

3. **Program/script:** Klik **Browse**
   - Navigasi ke: `C:\laragon\www\CV-BANYUMAKMUR\`
   - Pilih file: `task-scheduler-start.bat`
   - Klik **Open**

4. **Start in (optional):**
   - Isi: `C:\laragon\www\CV-BANYUMAKMUR`

5. Klik **Next**

#### Step 5: Finish & Configure

1. **Centang:** "Open the Properties dialog for this task when I click Finish"
2. Klik **Finish**

#### Step 6: Configure Advanced Settings

Window Properties akan terbuka:

1. **Tab General:**
   - ☑️ Centang: **Run whether user is logged on or not**
   - ☑️ Centang: **Run with highest privileges**
   - ☑️ Centang: **Hidden** (opsional, agar tidak muncul window)
   - Configure for: **Windows 10** atau **Windows 11**

2. **Tab Triggers:**
   - Klik **Edit**
   - ☑️ Centang: **Delay task for:** `30 seconds`
   - Klik **OK**

3. **Tab Actions:**
   - Pastikan sudah benar:
     ```
     Start a program
     Details: C:\laragon\www\CV-BANYUMAKMUR\task-scheduler-start.bat
     ```

4. **Tab Conditions:**
   - ☑️ Centang: **Start the task only if the computer is on AC power** (opsional)
   - ☐ Un-centang: **Stop if the computer switches to battery power**

5. **Tab Settings:**
   - ☑️ Centang: **Allow task to be run on demand**
   - ☑️ Centang: **Run task as soon as possible after a scheduled start is missed**
   - ☐ Un-centang: **Stop the task if it runs longer than:** (biarkan jalan terus)
   - If the running task does not end when requested: **Do not stop**

6. Klik **OK**

7. **Jika diminta password:**
   - Masukkan password Windows Anda
   - Klik **OK**

---

### METODE B: Import XML (Cepat)

#### Step 1: Buka File XML Template

1. Buka file: `task-scheduler-template.xml`
2. Edit baris berikut dengan **username Windows Anda**:

```xml
<UserId>GANTI-DENGAN-USERNAME-ANDA</UserId>
```

Contoh:
```xml
<UserId>Administrator</UserId>
```
atau
```xml
<UserId>User123</UserId>
```

3. Save file

#### Step 2: Import ke Task Scheduler

1. Buka Task Scheduler (`Win + R` → `taskschd.msc`)
2. Klik **Action** → **Import Task**
3. Browse ke file: `task-scheduler-template.xml`
4. Klik **Open**
5. Klik **OK**
6. Masukkan password Windows jika diminta

**Selesai!**

---

## ✅ VERIFIKASI SETUP

### Test Manual

1. Di Task Scheduler, cari task: **CV Banyu Makmur Startup**
2. Klik kanan → **Run**
3. Tunggu 30-45 detik
4. Aplikasi harus jalan dan browser harus terbuka

### Test Auto-Start

1. **Restart komputer**
2. **Login ke Windows**
3. **Tunggu 30-60 detik**
4. Aplikasi harus otomatis jalan
5. Browser harus otomatis buka `http://localhost:5173`

### Check Log File

Jika ada masalah, check file:
```
C:\laragon\www\CV-BANYUMAKMUR\startup.log
```

Log akan berisi:
- Waktu startup
- Status MySQL
- Status aplikasi
- Error jika ada

---

## 🛠️ TROUBLESHOOTING

### Task tidak jalan saat startup

**Penyebab:**
- Task Scheduler service tidak running
- Setting "Run with highest privileges" tidak di-centang
- Path file .bat salah

**Solusi:**
1. Buka Services (`services.msc`)
2. Cari "Task Scheduler"
3. Pastikan Status: **Running**
4. Startup type: **Automatic**
5. Cek setting task di Properties → General → "Run with highest privileges"

### MySQL tidak jalan

**Penyebab:**
- Delay kurang lama
- Laragon belum start

**Solusi:**
1. Edit `task-scheduler-start.bat`
2. Ubah delay dari 30 detik ke 60 detik:
   ```batch
   timeout /t 60 /nobreak >nul
   ```
3. Atau start Laragon manual sebelum aplikasi jalan

### npm command not found

**Penyebab:**
- Node.js tidak ada di System PATH
- Task running dengan user berbeda

**Solusi:**
1. Install Node.js di lokasi default (C:\Program Files\nodejs)
2. Pastikan Node.js ada di System PATH (bukan hanya User PATH)
3. Restart komputer setelah install Node.js

### Browser tidak auto-buka

**Penyebab:**
- Task running as system user
- Hidden mode enabled

**Solusi:**
1. Edit task Properties
2. Tab General → pilih "Run only when user is logged on"
3. Atau edit `task-scheduler-start.bat`, hapus baris:
   ```batch
   start http://localhost:5173
   ```

---

## 🔧 CUSTOMIZATION

### Ubah Delay Startup

Edit file `task-scheduler-start.bat` baris:
```batch
timeout /t 30 /nobreak >nul
```

Ubah `30` ke angka lain (dalam detik):
- `timeout /t 60 /nobreak >nul` = 60 detik (1 menit)
- `timeout /t 120 /nobreak >nul` = 120 detik (2 menit)

### Disable Auto-Open Browser

Edit file `task-scheduler-start.bat`, hapus atau comment baris:
```batch
REM start http://localhost:5173
```

### Ubah Port

Edit file `config.env`:
```env
PORT=5001              # Backend port (default: 5000)
FRONTEND_URL=http://localhost:5174  # Frontend URL
```

Edit file `client\vite.config.ts`:
```typescript
server: {
  port: 5174,  // Frontend port (default: 5173)
}
```

---

## 🗑️ CARA DISABLE/HAPUS

### Disable Task (Temporary)

1. Buka Task Scheduler
2. Cari task: **CV Banyu Makmur Startup**
3. Klik kanan → **Disable**

### Delete Task (Permanent)

1. Buka Task Scheduler
2. Cari task: **CV Banyu Makmur Startup**
3. Klik kanan → **Delete**
4. Konfirmasi **Yes**

---

## 📊 MONITORING

### Check Task Status

1. Buka Task Scheduler
2. Klik **Task Scheduler Library**
3. Cari task: **CV Banyu Makmur Startup**
4. Lihat kolom:
   - **Status:** Ready / Running / Disabled
   - **Last Run Time:** Kapan terakhir jalan
   - **Last Run Result:** Status terakhir (0x0 = sukses)
   - **Next Run Time:** Kapan akan jalan lagi

### View Task History

1. Klik task: **CV Banyu Makmur Startup**
2. Tab **History** di bawah
3. Lihat semua event:
   - Task Started
   - Task Completed
   - Errors

### View Application Log

Check file: `startup.log`
```
C:\laragon\www\CV-BANYUMAKMUR\startup.log
```

Format log:
```
[12/07/2025 08:30:00] Starting CV Banyu Makmur Application
[12/07/2025 08:30:05] MySQL is running
[12/07/2025 08:30:10] Starting npm run dev
[12/07/2025 08:30:35] Application started successfully
```

---

## 📝 NOTES

### Keuntungan Task Scheduler vs Startup Folder

| Feature | Task Scheduler | Startup Folder |
|---------|---------------|----------------|
| Delay startup | ✅ Yes | ❌ No |
| Run as admin | ✅ Yes | ⚠️ Terbatas |
| Hidden mode | ✅ Yes | ❌ No |
| Logging | ✅ Yes | ❌ No |
| Priority control | ✅ Yes | ❌ No |
| Recovery jika fail | ✅ Yes | ❌ No |
| User-friendly | ⚠️ Agak kompleks | ✅ Mudah |

### Rekomendasi

- **Development:** Gunakan Startup Folder (`setup-autostart.bat`)
- **Production/Client:** Gunakan Task Scheduler (`task-scheduler-start.bat`)

---

## 🎯 QUICK REFERENCE

### File Locations
```
C:\laragon\www\CV-BANYUMAKMUR\
├── task-scheduler-start.bat      ← Main script (RECOMMENDED)
├── task-scheduler-simple.bat     ← Simple version
├── task-scheduler-template.xml   ← XML template untuk import
├── startup.log                   ← Log file (auto-generated)
└── SETUP_TASK_SCHEDULER.md       ← This file
```

### Commands
```cmd
# Manual run task
schtasks /run /tn "CV Banyu Makmur Startup"

# Check task status
schtasks /query /tn "CV Banyu Makmur Startup"

# Delete task
schtasks /delete /tn "CV Banyu Makmur Startup" /f

# Disable task
schtasks /change /tn "CV Banyu Makmur Startup" /disable

# Enable task
schtasks /change /tn "CV Banyu Makmur Startup" /enable
```

---

## 📞 SUPPORT

Jika mengalami masalah:

1. **Check log file:** `startup.log`
2. **Check Task Scheduler History**
3. **Test manual:** Klik kanan task → Run
4. **Verify paths:** Pastikan semua path benar
5. **Check permissions:** Task harus run with highest privileges

---

**Created:** December 2025
**For:** CV Banyu Makmur - Koperasi Susu Management System
**Version:** 1.0
