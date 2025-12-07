# DOKUMENTASI TEKNIS - SISTEM KOPERASI SUSU
**Banyu Makmur Kitaka | v1.0.0 | November 2025**

---

## 📌 RINGKASAN APLIKASI

**Jenis:** Full Stack Web Application
**Tujuan:** Manajemen koperasi susu lengkap (pengumpulan, karyawan, keuangan, laporan)

### Stack Teknologi
- **Backend:** Node.js + Express.js + MySQL
- **Frontend:** React + TypeScript + Material-UI
- **Auth:** JWT (bcrypt password hashing)
- **Build:** Vite
- **Port:** Backend (5000), Frontend (5173), MySQL (3306)

---

## 🗂 STRUKTUR DATABASE

**Database:** `banyu_makmur` (MySQL)

### 10 Tabel Utama:
1. **users** - Login sistem
2. **milk_collectors** - Data peternak/pengepul
3. **milk_collections** - Koleksi susu harian (pagi/sore)
4. **milk_shipments** - Pengiriman susu
5. **employees** - Data karyawan
6. **employee_attendances** - Absensi (hadir/ijin/libur/sakit)
7. **employee_salaries** - Gaji bulanan (auto-calculate)
8. **incomes** - Pemasukan + upload bukti
9. **expenses** - Pengeluaran + upload bukti
10. **maintenances** - Pemeliharaan peralatan + foto

### Relasi Kunci:
- `milk_collectors (1) → (N) milk_collections`
- `employees (1) → (N) employee_attendances`
- `employees (1) → (N) employee_salaries`

---

## ✨ FITUR UTAMA (12 MODUL)

### 1. **Autentikasi**
- Login/Register/Logout
- JWT token (30 min expiry)
- Rate limiting (5 attempts/15 min)
- Auto logout (10 min idle)
- Password: bcrypt (salt 10)

### 2. **Pengepul Susu**
- CRUD lengkap
- Detail dengan summary 10 hari terakhir
- Prevent delete jika ada data koleksi

### 3. **Koleksi Susu**
- Dual entry: Pagi & Sore
- Filter by date & collector
- **Export Excel** (ExcelJS)
- **Bulk delete** per bulan
- Auto calculate total & income

### 4. **Pengiriman Susu**
- Track per tanggal
- Destination & amount
- Notes

### 5. **Karyawan**
- CRUD lengkap
- Detail + summary absensi 1 bulan
- Prevent delete jika ada absensi

### 6. **Absensi**
- 4 Status: Hadir, Ijin, Libur, Sakit
- Unique constraint (1 karyawan/hari)
- Bulk create untuk semua karyawan
- Filter by date & employee

### 7. **Gaji Karyawan**
- **Auto calculate** dari absensi
- Formula: `final_salary = (present_days × salary_per_day) - deductions + bonuses`
- Monthly salary per karyawan

### 8. **Pemasukan**
- CRUD + upload bukti (Multer)
- Source tracking
- Max 5MB (jpg/png/pdf)

### 9. **Pengeluaran**
- CRUD + upload bukti
- Category tracking
- Auto delete file saat hapus record

### 10. **Pemeliharaan**
- CRUD + upload foto
- Period tracking (start-end date)
- Cost management

### 11. **Dashboard**
- Real-time stats hari ini
- Monthly summary
- 4 Charts (Recharts): Weekly, Monthly, Financial, Attendance
- Recent activities (10 latest)

### 12. **Laporan Bulanan**
- Komprehensif (semua modul)
- **Export PDF** (jsPDF + autoTable)
- Financial summary

---

## 📡 API ENDPOINTS

**Total: 65+ Endpoints**

| Modul | Endpoints | Fitur Khusus |
|-------|-----------|--------------|
| Auth | 5 | Login, Register, Logout, Reset, Me |
| Collectors | 6 | CRUD + Stats |
| Collections | 8 | CRUD + Excel + Bulk Delete |
| Employees | 6 | CRUD + Detail Summary |
| Attendances | 7 | CRUD + Bulk + Salary Calc |
| Incomes | 5 | CRUD + Upload |
| Expenses | 5 | CRUD + Upload |
| Maintenances | 5 | CRUD + Upload |
| Shipments | 5 | CRUD |
| Dashboard | 11 | Stats + 4 Charts |
| Reports | 2 | Monthly Report |

**Pattern:** `/api/{modul}/{action}`

**Contoh:**
- `POST /api/auth/login` - Login
- `GET /api/collections?start_date=2025-01-01&end_date=2025-01-31` - Filter koleksi
- `GET /api/collections/export/excel` - Export Excel
- `POST /api/attendances/salaries/calculate` - Hitung gaji otomatis
- `GET /api/reports/monthly?month=11&year=2025` - Laporan bulanan

---

## 🔐 KEAMANAN

### Password
- **bcrypt** hashing (salt rounds: 10)
- Min 6 karakter

### JWT Token
- Algorithm: **HS256**
- Expiry: **30 minutes**
- Payload: `{userId, username, iat, exp, type: 'access'}`
- Blacklist untuk logout

### Middleware Auth
6 Security checks:
1. Token format validation
2. JWT signature verify
3. Token expiry check
4. Blacklist check
5. User DB verification
6. Payload validation

### Rate Limiting
- Login: Max 5 attempts per 15 min per IP
- In-memory store (production: Redis)

### Input Validation
- **express-validator**
- Required, length, format, regex

### File Upload
- **Multer** middleware
- Max 5MB
- Types: jpg, png, pdf
- Unique filename with timestamp

### CORS
- Origin: `http://localhost:5173`
- Credentials: true

### Session
- Auto logout: 10 min idle
- Activity tracking: mouse, keyboard, scroll, touch

---

## 🔄 ALUR KERJA UTAMA

### Login Flow
```
User input → POST /api/auth/login → Validate credentials →
bcrypt.compare → Generate JWT → Save to localStorage →
Set Axios header → Redirect dashboard
```

### Koleksi Susu Flow
```
Form input (collector, date, pagi, sore, price) → Frontend validation →
POST /api/collections → Backend validation → Check duplicate →
INSERT database → Auto calculate total → Return success →
Refresh DataGrid
```

### Gaji Otomatis Flow
```
Click "Hitung Gaji" → POST /api/attendances/salaries/calculate →
For each employee: Get attendances → COUNT by status →
Calculate (present_days × salary_per_day) →
INSERT/UPDATE employee_salaries → Return summary
```

### Laporan Bulanan Flow
```
Select month/year → GET /api/reports/monthly →
Parallel queries (7 tables) → Calculate summary →
Display tables + charts → Export PDF (jsPDF)
```

---

## 📚 LIBRARY & DEPENDENCIES

### Backend (9 libraries)
```
bcryptjs, cors, dotenv, exceljs, express,
express-validator, jsonwebtoken, moment, mysql2
```

### Frontend (15+ libraries)
```
React, TypeScript, Material-UI, Axios,
React Router, Recharts, jsPDF, SweetAlert2,
React Hook Form, Zod, jwt-decode, dayjs
```

---

## 📊 STATISTIK

- **Total Files:** 36
- **Lines of Code:** ~9,500
- **Backend Routes:** 11 files (~3,500 LOC)
- **Frontend Pages:** 11 files (~4,000 LOC)
- **API Endpoints:** 65+
- **Database Tables:** 10

---

## 🚀 CARA DEPLOY

### Untuk Client (Windows + Laragon):

1. **Install Prerequisites**
   - Laragon (includes MySQL)
   - Node.js 18+ LTS

2. **Setup Database**
   - Buat database: `banyu_makmur`
   - Import: `banyu_makmur.sql`

3. **Install Dependencies**
   ```bash
   # Backend
   npm install

   # Frontend
   cd client
   npm install
   npm run build
   ```

4. **Auto-Start** (Optional)
   ```bash
   setup-autostart.bat
   ```

5. **Manual Start**
   ```bash
   start-app.bat
   ```

6. **Akses**
   - Localhost: `http://localhost:5173`
   - LAN: `http://[IP-SERVER]:5173`
   - Login: `admin` / `admin123`

---

## 🎯 FITUR UNGGULAN

✅ **Dual Entry** - Koleksi pagi & sore dalam 1 hari
✅ **Auto Calculate** - Gaji dari absensi otomatis
✅ **Export** - Excel (koleksi) & PDF (laporan)
✅ **Upload** - Bukti transaksi (pemasukan/pengeluaran/maintenance)
✅ **Real-time** - Dashboard live statistics
✅ **Bulk Operations** - Delete per bulan, create absensi massal
✅ **Comprehensive Reports** - Laporan bulanan all-in-one
✅ **Security** - JWT + bcrypt + rate limiting + session timeout
✅ **Validation** - Frontend (Zod) + Backend (express-validator)
✅ **Responsive** - Material-UI adaptive design

---


## 🏗 ARSITEKTUR

```
Browser (React + TS) → Port 5173
    ↕ HTTP/HTTPS (Axios)
Express Server → Port 5000
    ↕ SQL Queries
MySQL Database → Port 3306
```

**Pattern:** Client-Server REST API

**Middleware Stack:**
1. CORS
2. Body Parser (JSON)
3. Multer (File Upload)
4. Auth (JWT)
5. Validation (express-validator)

---

## 💡 BUSINESS LOGIC

### Koleksi Susu
- 1 collector bisa input pagi & sore di hari yang sama
- Tidak boleh duplikasi waktu yang sama
- Edit hanya untuk waktu yang sudah ada

### Gaji Karyawan
```javascript
total_working_days = present_days + sick_days
salary_per_day = base_salary / total_working_days
total_salary = present_days × salary_per_day
final_salary = total_salary - deductions + bonuses
```

### Laporan Keuangan
```javascript
netIncome = (totalIncome + totalMilkValue) -
            (totalExpense + totalMaintenance + totalSalary)
```

---

**Status:** ✅ Production Ready
**Update:** November 2025
**License:** Internal Use

---

*Dokumentasi ringkas untuk komunikasi dengan AI chat. Untuk detail lengkap, lihat DOKUMENTASI_TEKNIS_LENGKAP.md*
