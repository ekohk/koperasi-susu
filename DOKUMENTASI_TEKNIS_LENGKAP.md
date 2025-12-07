# DOKUMENTASI TEKNIS LENGKAP
# SISTEM MANAJEMEN KOPERASI SUSU BANYU MAKMUR KITAKA

**Versi:** 1.0.0
**Tanggal:** November 2025
**Platform:** Web Application (Full Stack)
**Database:** MySQL
**Deployment:** Laragon (Local/Network)

---

## 📋 DAFTAR ISI

1. [Teknologi & Bahasa Pemrograman](#teknologi--bahasa-pemrograman)
2. [Arsitektur Aplikasi](#arsitektur-aplikasi)
3. [Struktur Database](#struktur-database)
4. [Fitur-Fitur Aplikasi](#fitur-fitur-aplikasi)
5. [Alur Kerja Aplikasi](#alur-kerja-aplikasi)
6. [API Endpoints](#api-endpoints)
7. [Keamanan & Autentikasi](#keamanan--autentikasi)
8. [Flow Diagram](#flow-diagram)
9. [Dependency & Library](#dependency--library)

---

## 🛠 TEKNOLOGI & BAHASA PEMROGRAMAN

### **Backend (Server-Side)**

#### **1. Node.js (Runtime Environment)**
- **Versi:** 18+ (LTS)
- **Fungsi:** JavaScript runtime untuk menjalankan server
- **File utama:** `server.js`
- **Port:** 5000 (default)

#### **2. Express.js (Web Framework)**
- **Versi:** ^4.18.2
- **Bahasa:** JavaScript (ES6+)
- **Fungsi:**
  - Routing HTTP requests
  - Middleware management
  - RESTful API development
  - Static file serving

**Contoh Penggunaan:**
```javascript
const express = require('express');
const app = express();
app.use('/api/auth', require('./routes/auth'));
```

#### **3. MySQL2 (Database Driver)**
- **Versi:** ^3.6.5
- **Fungsi:**
  - Koneksi ke database MySQL
  - Promise-based queries
  - Connection pooling

**Contoh Penggunaan:**
```javascript
const [employees] = await db.promise().query(
  'SELECT * FROM employees ORDER BY created_at DESC'
);
```

### **Frontend (Client-Side)**

#### **1. React (UI Library)**
- **Versi:** ^18.3.1
- **Bahasa:** TypeScript (.tsx files)
- **Fungsi:**
  - Component-based UI
  - State management
  - Virtual DOM for performance

#### **2. TypeScript (Programming Language)**
- **Versi:** ^5.5.4
- **Fungsi:**
  - Type safety
  - Better IDE support
  - Fewer runtime errors

**Contoh Penggunaan:**
```typescript
interface User {
  id: number;
  username: string;
  fullname: string;
}
```

#### **3. Vite (Build Tool)**
- **Versi:** ^5.4.1
- **Port:** 5173 (development/preview)
- **Fungsi:**
  - Hot Module Replacement (HMR)
  - Fast build times
  - Production optimization

#### **4. Material-UI (MUI)**
- **Versi:** ^5.15.20
- **Fungsi:**
  - Pre-built React components
  - Responsive design
  - Theme customization
  - Icons (@mui/icons-material)

**Komponen yang Digunakan:**
- `DataGrid` - Tabel data
- `Dialog` - Modal/popup
- `TextField` - Input forms
- `Button`, `Card`, `AppBar`, dll.

### **Bahasa Pemrograman Detail**

| Komponen | Bahasa | File Extension | Persentase |
|----------|--------|----------------|------------|
| **Backend** | JavaScript (Node.js) | `.js` | ~40% |
| **Frontend** | TypeScript | `.tsx`, `.ts` | ~50% |
| **Database** | SQL | `.sql` | ~5% |
| **Styling** | CSS (in JS) | Embedded | ~3% |
| **Config** | JSON, ENV | `.json`, `.env` | ~2% |

---

## 🏗 ARSITEKTUR APLIKASI

### **Pola Arsitektur: Client-Server dengan REST API**

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React + TypeScript + Material-UI (Port 5173)        │  │
│  │  - Components (UI)                                     │  │
│  │  - Pages (Routes)                                      │  │
│  │  - Context (State Management)                          │  │
│  │  - Axios (HTTP Client)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js - Port 5000)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js API Server                                │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Middleware Layer                               │  │  │
│  │  │  - CORS                                          │  │  │
│  │  │  - Body Parser (JSON)                            │  │  │
│  │  │  - Authentication (JWT)                          │  │  │
│  │  │  - File Upload (Multer)                          │  │  │
│  │  │  - Validation (express-validator)                │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Routes Layer (API Endpoints)                   │  │  │
│  │  │  - /api/auth       (Authentication)             │  │  │
│  │  │  - /api/collectors (Pengepul Susu)              │  │  │
│  │  │  - /api/collections (Koleksi Susu)              │  │  │
│  │  │  - /api/employees  (Karyawan)                   │  │  │
│  │  │  - /api/attendances (Absensi)                   │  │  │
│  │  │  - /api/incomes    (Pemasukan)                  │  │  │
│  │  │  - /api/expenses   (Pengeluaran)                │  │  │
│  │  │  - /api/maintenances (Pemeliharaan)             │  │  │
│  │  │  - /api/shipments  (Pengiriman)                 │  │  │
│  │  │  - /api/dashboard  (Dashboard Stats)            │  │  │
│  │  │  - /api/reports    (Laporan Bulanan)            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database: banyu_makmur                               │  │
│  │  Tables (10):                                          │  │
│  │  - users                                               │  │
│  │  - milk_collectors                                     │  │
│  │  - milk_collections                                    │  │
│  │  - milk_shipments                                      │  │
│  │  - employees                                           │  │
│  │  - employee_attendances                                │  │
│  │  - employee_salaries                                   │  │
│  │  - incomes                                             │  │
│  │  - expenses                                            │  │
│  │  - maintenances                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Struktur Folder Project**

```
banyumakmurtikitaka/
│
├── 📁 config/
│   └── database.js              # Konfigurasi koneksi MySQL
│
├── 📁 middleware/
│   ├── auth.js                  # JWT authentication middleware
│   └── upload.js                # Multer file upload middleware
│
├── 📁 routes/                   # API Routes (11 files)
│   ├── auth.js                  # Login, Register, Reset Password
│   ├── collectors.js            # CRUD Pengepul Susu
│   ├── collections.js           # CRUD Koleksi Susu + Export Excel
│   ├── employees.js             # CRUD Karyawan
│   ├── attendances.js           # CRUD Absensi Karyawan
│   ├── expenses.js              # CRUD Pengeluaran + Upload Bukti
│   ├── incomes.js               # CRUD Pemasukan + Upload Bukti
│   ├── maintenances.js          # CRUD Pemeliharaan + Upload Foto
│   ├── shipments.js             # CRUD Pengiriman Susu
│   ├── dashboard.js             # Statistik Dashboard & Charts
│   └── reports.js               # Laporan Bulanan Komprehensif
│
├── 📁 uploads/                  # Folder untuk file upload
│   ├── incomes/                 # Bukti pemasukan
│   ├── expenses/                # Bukti pengeluaran
│   └── maintenances/            # Foto pemeliharaan
│
├── 📁 client/                   # Frontend React + TypeScript
│   ├── 📁 src/
│   │   ├── 📁 auth/
│   │   │   ├── AuthContext.tsx  # Authentication state management
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   │
│   │   ├── 📁 components/       # Reusable components
│   │   │   ├── ModernButton.tsx
│   │   │   ├── ModernTable.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── Notification.tsx
│   │   │
│   │   ├── 📁 layouts/
│   │   │   └── DashboardLayout.tsx # Main layout with sidebar
│   │   │
│   │   ├── 📁 pages/            # All pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── DashboardHome.tsx
│   │   │   ├── 📁 collectors/
│   │   │   │   └── CollectorsPage.tsx
│   │   │   ├── 📁 collections/
│   │   │   │   └── CollectionsPage.tsx
│   │   │   ├── 📁 employees/
│   │   │   │   └── EmployeesPage.tsx
│   │   │   ├── 📁 attendances/
│   │   │   │   └── AttendancesPage.tsx
│   │   │   ├── 📁 incomes/
│   │   │   │   └── IncomesPage.tsx
│   │   │   ├── 📁 expenses/
│   │   │   │   └── ExpensesPage.tsx
│   │   │   ├── 📁 maintenances/
│   │   │   │   └── MaintenancesPage.tsx
│   │   │   ├── 📁 shipments/
│   │   │   │   └── ShipmentsPage.tsx
│   │   │   └── 📁 reports/
│   │   │       └── MonthlyReportPage.tsx
│   │   │
│   │   ├── 📁 utils/
│   │   │   └── sweetalert.ts    # SweetAlert2 utilities
│   │   │
│   │   ├── App.tsx               # Main app with routing
│   │   ├── main.tsx              # Entry point
│   │   └── vite-env.d.ts        # TypeScript definitions
│   │
│   ├── vite.config.ts           # Vite configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── package.json             # Frontend dependencies
│
├── server.js                    # Main server file
├── config.env                   # Environment variables
├── package.json                 # Backend dependencies
├── banyu_makmur.sql            # Database structure & data
└── README.md                    # Documentation

```

---

## 💾 STRUKTUR DATABASE

### **Database: `banyu_makmur`**

#### **Tabel 1: `users` - Pengguna Sistem**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,      -- Hashed dengan bcrypt
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  auth_provider ENUM('local', 'google') DEFAULT 'local',
  reset_token VARCHAR(255),
  reset_token_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Fungsi:** Menyimpan data user untuk login sistem

---

#### **Tabel 2: `milk_collectors` - Pengepul Susu**
```sql
CREATE TABLE milk_collectors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Fungsi:** Data peternak/pengumpul susu

---

#### **Tabel 3: `milk_collections` - Koleksi Susu Harian**
```sql
CREATE TABLE milk_collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  collector_id INT NOT NULL,
  morning_amount DECIMAL(10,2) DEFAULT 0,     -- Liter pagi
  afternoon_amount DECIMAL(10,2) DEFAULT 0,    -- Liter sore
  price_per_liter DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collector_id) REFERENCES milk_collectors(id)
    ON DELETE CASCADE
);
```
**Fungsi:** Catatan pengumpulan susu per hari (pagi/sore)

**Relasi:** `milk_collectors (1) ──< (N) milk_collections`

---

#### **Tabel 4: `milk_shipments` - Pengiriman Susu**
```sql
CREATE TABLE milk_shipments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,    -- Liter
  destination VARCHAR(255),          -- Tujuan pengiriman
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Fungsi:** Tracking pengiriman susu ke distributor

---

#### **Tabel 5: `employees` - Karyawan**
```sql
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,    -- Jabatan
  salary DECIMAL(12,2) NOT NULL,     -- Gaji pokok
  join_date DATE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Fungsi:** Data karyawan koperasi

---

#### **Tabel 6: `employee_attendances` - Absensi Karyawan**
```sql
CREATE TABLE employee_attendances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('hadir', 'ijin', 'libur', 'sakit') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
    ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (employee_id, date)
);
```
**Fungsi:** Presensi harian karyawan

**Relasi:** `employees (1) ──< (N) employee_attendances`

---

#### **Tabel 7: `employee_salaries` - Gaji Karyawan**
```sql
CREATE TABLE employee_salaries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  month INT NOT NULL,                -- 1-12
  year INT NOT NULL,
  base_salary DECIMAL(12,2) NOT NULL,
  present_days INT DEFAULT 0,
  absent_days INT DEFAULT 0,
  sick_days INT DEFAULT 0,
  holiday_days INT DEFAULT 0,
  total_working_days INT NOT NULL,
  salary_per_day DECIMAL(12,2) NOT NULL,
  total_salary DECIMAL(12,2) NOT NULL,
  deductions DECIMAL(12,2) DEFAULT 0,
  bonuses DECIMAL(12,2) DEFAULT 0,
  final_salary DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
    ON DELETE CASCADE,
  UNIQUE KEY unique_salary (employee_id, month, year)
);
```
**Fungsi:** Perhitungan gaji bulanan karyawan berdasarkan absensi

**Formula:**
```
salary_per_day = base_salary / total_working_days
total_salary = present_days × salary_per_day
final_salary = total_salary - deductions + bonuses
```

**Relasi:** `employees (1) ──< (N) employee_salaries`

---

#### **Tabel 8: `incomes` - Pemasukan**
```sql
CREATE TABLE incomes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  source VARCHAR(255) NOT NULL,      -- Sumber pemasukan
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  proof_image VARCHAR(255),          -- Path file bukti
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Fungsi:** Catatan pemasukan koperasi

---

#### **Tabel 9: `expenses` - Pengeluaran**
```sql
CREATE TABLE expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(100) NOT NULL,    -- Kategori pengeluaran
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  proof_image VARCHAR(255),          -- Path file bukti
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Fungsi:** Catatan pengeluaran koperasi

---

#### **Tabel 10: `maintenances` - Pemeliharaan**
```sql
CREATE TABLE maintenances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_name VARCHAR(255) NOT NULL,   -- Nama barang
  start_date DATE NOT NULL,
  end_date DATE,
  cost DECIMAL(12,2) NOT NULL,
  photo_path VARCHAR(255),           -- Path foto
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Fungsi:** Dokumentasi pemeliharaan peralatan

---

### **Entity Relationship Diagram (ERD)**

```
┌─────────────────┐
│     users       │
│ (Authentication)│
└─────────────────┘

┌─────────────────┐         ┌──────────────────┐
│milk_collectors  │ 1─────N │milk_collections  │
│  (Peternak)     │         │ (Koleksi Harian) │
└─────────────────┘         └──────────────────┘

┌─────────────────┐
│milk_shipments   │
│  (Pengiriman)   │
└─────────────────┘

┌─────────────────┐         ┌──────────────────────┐
│   employees     │ 1─────N │employee_attendances  │
│  (Karyawan)     │         │    (Absensi)         │
└─────────────────┘         └──────────────────────┘
        │ 1
        │
        │ N
┌──────────────────┐
│employee_salaries │
│  (Gaji Bulanan)  │
└──────────────────┘

┌─────────────────┐         ┌─────────────────┐
│    incomes      │         │    expenses     │
│  (Pemasukan)    │         │  (Pengeluaran)  │
└─────────────────┘         └─────────────────┘

┌─────────────────┐
│  maintenances   │
│ (Pemeliharaan)  │
└─────────────────┘
```

---

## ✨ FITUR-FITUR APLIKASI

### **1. AUTENTIKASI & KEAMANAN**

#### **A. Login System**
- **Endpoint:** `POST /api/auth/login`
- **Teknologi:** JWT (JSON Web Token)
- **Keamanan:**
  - Password di-hash menggunakan **bcrypt** (salt rounds: 10)
  - Rate limiting: Max 5 percobaan login per 15 menit per IP
  - Token expiry: 30 menit
  - Token blacklist untuk logout

**Flow Login:**
```
1. User input username & password
2. Frontend kirim ke POST /api/auth/login
3. Backend validasi credentials
4. Jika valid → Generate JWT token (HS256)
5. Token disimpan di localStorage
6. Axios set Authorization header: "Bearer {token}"
7. Redirect ke dashboard
```

**Fitur Keamanan JWT:**
```javascript
const token = jwt.sign(
  {
    userId: user.id,
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    type: 'access'
  },
  process.env.JWT_SECRET,
  { expiresIn: '30m', algorithm: 'HS256' }
);
```

#### **B. Register System**
- **Endpoint:** `POST /api/auth/register`
- **Validasi:**
  - Username: 3-50 karakter, hanya alphanumeric + underscore
  - Password: Min 6 karakter
  - Fullname: Min 3 karakter
  - Check duplicate username

#### **C. Forgot Password**
- **Endpoint:** `POST /api/auth/reset-password`
- **Fitur:** Direct password reset (untuk development/internal)
- **Production:** Bisa diintegrasikan dengan email service

#### **D. Session Management**
- **Auto Logout:** Setelah 10 menit tidak aktif (idle timeout)
- **Activity Tracking:** Monitor mouse, keyboard, scroll, touch events
- **Token Expiry:** Auto logout saat token kadaluarsa
- **Interceptor:** Axios auto-detect 401 response → logout

---

### **2. MANAJEMEN PENGEPUL SUSU**

#### **Fitur:**
- ✅ **Create** pengepul baru
- ✅ **Read** list semua pengepul
- ✅ **Update** data pengepul
- ✅ **Delete** pengepul (jika belum ada data koleksi)
- ✅ **Detail View** dengan summary 10 hari terakhir

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/collectors` | List semua pengepul |
| GET | `/api/collectors/:id` | Detail pengepul + summary |
| POST | `/api/collectors` | Tambah pengepul baru |
| PUT | `/api/collectors/:id` | Update data pengepul |
| DELETE | `/api/collectors/:id` | Hapus pengepul |
| GET | `/api/collectors/stats/summary` | Statistik pengepul |

**Summary Data:**
```javascript
{
  total_amount: 150.5,      // Total liter 10 hari
  total_income: 4515000,    // Total pendapatan
  average_amount: 15.05,    // Rata-rata per hari
  days_count: 10            // Jumlah hari
}
```

---

### **3. MANAJEMEN KOLEKSI SUSU**

#### **Fitur Utama:**
- ✅ **Dual Entry:** Pagi & Sore dalam satu hari
- ✅ **Filter:** By date range & collector
- ✅ **Export Excel:** ExcelJS library
- ✅ **Bulk Delete:** Hapus semua data per bulan
- ✅ **Auto Calculation:** Total amount & income

**Business Rules:**
1. **Tidak boleh duplikasi** koleksi pagi/sore untuk collector & date yang sama
2. **Minimal 1 waktu** harus diisi (pagi atau sore > 0)
3. **Edit restriction:** Hanya bisa edit waktu yang sudah ada sebelumnya

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/collections` | List dengan filter |
| GET | `/api/collections/:id` | Detail koleksi |
| POST | `/api/collections` | Tambah koleksi baru |
| PUT | `/api/collections/:id` | Update koleksi |
| DELETE | `/api/collections/:id` | Hapus koleksi |
| DELETE | `/api/collections/bulk/delete-by-month` | Bulk delete per bulan |
| GET | `/api/collections/stats/available-months` | Bulan yang ada data |
| GET | `/api/collections/export/excel` | Export ke Excel |

**Excel Export Format:**
- Tanggal
- Nama Pengepul
- Telepon
- Jumlah Pagi (L)
- Jumlah Sore (L)
- Total (L)
- Harga/Liter
- Total Pendapatan

**Library:** ExcelJS ^4.4.0

---

### **4. MANAJEMEN PENGIRIMAN SUSU**

#### **Fitur:**
- ✅ **Track pengiriman** per tanggal
- ✅ **Destination** tujuan pengiriman
- ✅ **Amount** jumlah liter yang dikirim
- ✅ **Notes** catatan tambahan

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/shipments` | List pengiriman dengan filter |
| GET | `/api/shipments/:id` | Detail pengiriman |
| POST | `/api/shipments` | Tambah pengiriman |
| PUT | `/api/shipments/:id` | Update pengiriman |
| DELETE | `/api/shipments/:id` | Hapus pengiriman |

---

### **5. MANAJEMEN KARYAWAN**

#### **Fitur:**
- ✅ **CRUD Karyawan** lengkap
- ✅ **Detail View** dengan summary absensi 1 bulan
- ✅ **Prevent Delete** jika ada data absensi

**Data Karyawan:**
- Nama, Posisi, Gaji Pokok
- Tanggal Bergabung
- Telepon, Alamat

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/employees` | List semua karyawan |
| GET | `/api/employees/:id` | Detail karyawan |
| GET | `/api/employees/:id/detail` | Detail + summary absensi |
| POST | `/api/employees` | Tambah karyawan |
| PUT | `/api/employees/:id` | Update karyawan |
| DELETE | `/api/employees/:id` | Hapus karyawan |

**Summary Absensi:**
```javascript
{
  total_days: 20,
  present_days: 18,      // Hadir
  absent_days: 1,        // Ijin
  holiday_days: 1,       // Libur
  sick_days: 0,          // Sakit
  attendance_rate: 90    // Persentase kehadiran
}
```

---

### **6. MANAJEMEN ABSENSI**

#### **Fitur:**
- ✅ **Daily attendance** per karyawan
- ✅ **4 Status:** Hadir, Ijin, Libur, Sakit
- ✅ **Unique constraint:** 1 karyawan hanya 1 absensi per hari
- ✅ **Filter:** By date range & employee
- ✅ **Bulk Create:** Absensi massal untuk semua karyawan

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/attendances` | List absensi dengan filter |
| GET | `/api/attendances/:id` | Detail absensi |
| POST | `/api/attendances` | Tambah absensi |
| PUT | `/api/attendances/:id` | Update status absensi |
| DELETE | `/api/attendances/:id` | Hapus absensi |
| POST | `/api/attendances/bulk` | Bulk create absensi |

**Bulk Create Example:**
```javascript
{
  "date": "2025-01-15",
  "status": "hadir",
  "employee_ids": [1, 2, 3, 4]
}
```

---

### **7. MANAJEMEN GAJI KARYAWAN**

#### **Fitur:**
- ✅ **Auto Calculate** dari data absensi
- ✅ **Monthly Salary** per karyawan per bulan
- ✅ **Deductions & Bonuses**
- ✅ **Daily Rate Calculation**

**Formula Perhitungan:**
```javascript
// 1. Hitung total hari kerja (hadir + sakit)
total_working_days = present_days + sick_days;

// 2. Gaji per hari
salary_per_day = base_salary / total_working_days;

// 3. Total gaji sebelum potongan/bonus
total_salary = present_days × salary_per_day;

// 4. Gaji final
final_salary = total_salary - deductions + bonuses;
```

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/attendances/salaries/:year/:month` | Gaji per bulan |
| POST | `/api/attendances/salaries/calculate` | Hitung gaji otomatis |

**Auto Calculation Process:**
1. Ambil semua data absensi per bulan per karyawan
2. Hitung present, absent, sick, holiday days
3. Apply formula
4. Insert/Update ke tabel employee_salaries

---

### **8. MANAJEMEN PEMASUKAN**

#### **Fitur:**
- ✅ **CRUD Pemasukan** lengkap
- ✅ **Upload Bukti** (gambar/foto)
- ✅ **File Management** dengan Multer
- ✅ **Source Tracking** sumber pemasukan

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/incomes` | List pemasukan dengan filter |
| GET | `/api/incomes/:id` | Detail pemasukan |
| POST | `/api/incomes` | Tambah pemasukan + upload |
| PUT | `/api/incomes/:id` | Update pemasukan + upload |
| DELETE | `/api/incomes/:id` | Hapus pemasukan |

**Upload Configuration:**
```javascript
// Multer middleware
const storage = multer.diskStorage({
  destination: './uploads/incomes/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'income-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Validasi
- Max file size: 5MB
- Allowed types: jpg, jpeg, png, pdf
```

---

### **9. MANAJEMEN PENGELUARAN**

#### **Fitur:**
- ✅ **CRUD Pengeluaran** lengkap
- ✅ **Upload Bukti** (gambar/foto)
- ✅ **Category Tracking**
- ✅ **Delete with File** (hapus file saat delete record)

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/expenses` | List pengeluaran dengan filter |
| GET | `/api/expenses/:id` | Detail pengeluaran |
| POST | `/api/expenses` | Tambah pengeluaran + upload |
| PUT | `/api/expenses/:id` | Update pengeluaran + upload |
| DELETE | `/api/expenses/:id` | Hapus pengeluaran |

**Upload Folder:** `./uploads/expenses/`

---

### **10. MANAJEMEN PEMELIHARAAN**

#### **Fitur:**
- ✅ **CRUD Maintenance** peralatan
- ✅ **Upload Foto** dokumentasi
- ✅ **Period Tracking** (start & end date)
- ✅ **Cost Management**

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/maintenances` | List pemeliharaan |
| GET | `/api/maintenances/:id` | Detail pemeliharaan |
| POST | `/api/maintenances` | Tambah pemeliharaan + upload |
| PUT | `/api/maintenances/:id` | Update pemeliharaan + upload |
| DELETE | `/api/maintenances/:id` | Hapus pemeliharaan |

**Upload Folder:** `./uploads/maintenances/`

---

### **11. DASHBOARD & STATISTIK**

#### **Fitur:**
- ✅ **Real-time Stats** hari ini
- ✅ **Monthly Summary**
- ✅ **Charts & Graphs** (Recharts)
- ✅ **Recent Activities** (10 data terakhir)

**Dashboard Widgets:**

**A. Overview Stats**
```javascript
{
  collectors: 50,           // Total pengepul
  employees: 12,            // Total karyawan
  today: {
    collections: {
      total_collections: 45,
      total_milk: 500.5,    // Liter
      total_income: 15015000
    },
    attendances: {
      total_attendance: 12,
      present: 11,
      leave: 0,
      holiday: 1,
      sick: 0
    }
  },
  monthly: {
    collections: { ... },
    income: { ... },
    expenses: { ... },
    maintenance: { ... }
  }
}
```

**B. Charts Available:**
1. **Weekly Collections** - Line chart
2. **Monthly Collections** - Bar chart
3. **Financial Monthly** - Multi-line chart (income, expense, profit)
4. **Attendance Status** - Pie chart

**API Endpoints:**
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/dashboard/overview` | Statistik utama |
| GET | `/api/dashboard/recent-collections` | 10 koleksi terakhir |
| GET | `/api/dashboard/recent-attendances` | 10 absensi terakhir |
| GET | `/api/dashboard/recent-incomes` | 10 pemasukan terakhir |
| GET | `/api/dashboard/recent-expenses` | 10 pengeluaran terakhir |
| GET | `/api/dashboard/recent-maintenances` | 10 pemeliharaan terakhir |
| GET | `/api/dashboard/recent-shipments` | 5 pengiriman terakhir |
| GET | `/api/dashboard/charts/collections-weekly` | Data chart weekly |
| GET | `/api/dashboard/charts/collections-monthly` | Data chart monthly |
| GET | `/api/dashboard/charts/financial-monthly` | Data chart finansial |
| GET | `/api/dashboard/charts/attendance-status` | Data chart absensi |

---

### **12. LAPORAN BULANAN KOMPREHENSIF**

#### **Fitur:**
- ✅ **Monthly Report** semua modul
- ✅ **Export PDF** (jsPDF + autoTable)
- ✅ **Comprehensive Data:**
  - Koleksi susu per pengepul
  - Absensi karyawan
  - Gaji karyawan
  - Pemasukan
  - Pengeluaran
  - Pemeliharaan
  - Pengiriman
  - **Summary Keuangan**

**API Endpoint:**
```
GET /api/reports/monthly?month=11&year=2025
```

**Response Structure:**
```javascript
{
  success: true,
  data: {
    period: {
      month: 11,
      year: 2025,
      monthName: "November"
    },
    milkCollections: {
      summary: [
        {
          collector_id: 1,
          collector_name: "Pak Budi",
          total_amount: 450.5,
          avg_price: 3000,
          total_value: 1351500,
          collection_days: 30
        }
      ],
      total: {
        total_amount: 15000.5,
        avg_price: 3000,
        total_value: 45001500,
        total_days: 900
      }
    },
    attendance: [ ... ],
    salaries: [ ... ],
    incomes: {
      items: [ ... ],
      total: 50000000
    },
    expenses: {
      items: [ ... ],
      total: 20000000
    },
    maintenances: {
      items: [ ... ],
      total: 5000000
    },
    shipments: {
      items: [ ... ],
      total: 14500.0
    },
    summary: {
      totalIncome: 50000000,
      totalMilkValue: 45001500,
      totalExpense: 20000000,
      totalMaintenance: 5000000,
      totalShipment: 14500.0,
      totalSalary: 15000000
    }
  }
}
```

**PDF Export Features:**
- Header dengan periode laporan
- Tabel per kategori
- Summary keuangan
- Auto page break
- Professional formatting

**Library:**
- jsPDF ^2.5.1
- jspdf-autotable ^3.8.2

---

## 🔄 ALUR KERJA APLIKASI

### **FLOW 1: Login & Authentication**

```
┌────────────────────────────────────────────────────────────┐
│ 1. USER AKSES APLIKASI                                     │
│    http://localhost:5173                                   │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 2. REACT ROUTER CHECK                                      │
│    - Cek localStorage ada token?                           │
│    - Tidak → Redirect ke /login                            │
│    - Ya → Verify token via /api/auth/me                    │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 3. LOGIN PAGE                                              │
│    - Input username & password                             │
│    - Validation (min length, required)                     │
│    - Submit → POST /api/auth/login                         │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 4. BACKEND AUTHENTICATION                                  │
│    a. Rate limiting check (max 5 attempts/15 min)          │
│    b. Input validation (express-validator)                 │
│    c. Query user dari database                             │
│    d. bcrypt.compare(password, hashedPassword)             │
│    e. Generate JWT token (exp: 30 min)                     │
│    f. Return token + user data                             │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 5. FRONTEND TOKEN HANDLING                                 │
│    a. localStorage.setItem('token', token)                 │
│    b. axios.defaults.headers.common['Authorization']       │
│       = 'Bearer ' + token                                  │
│    c. Set user state in AuthContext                        │
│    d. Navigate to dashboard ("/")                          │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 6. PROTECTED ROUTE ACCESS                                  │
│    - Setiap request ke API include header:                 │
│      Authorization: Bearer {token}                         │
│    - Backend auth middleware verify JWT                    │
│    - Attach req.user untuk digunakan routes                │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 7. SESSION MANAGEMENT                                      │
│    - Track user activity (mouse, keyboard, etc)            │
│    - Jika idle 10 menit → Auto logout                      │
│    - Jika token expired → Interceptor catch 401            │
│      → Show alert → Logout → Redirect /login               │
└────────────────────────────────────────────────────────────┘
```

---

### **FLOW 2: Koleksi Susu Harian**

```
┌────────────────────────────────────────────────────────────┐
│ 1. USER BUKA HALAMAN KOLEKSI SUSU                          │
│    /collections                                            │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 2. FETCH DATA AWAL                                         │
│    a. GET /api/collections (dengan filter jika ada)        │
│    b. GET /api/collectors (untuk dropdown)                 │
│    c. Display di MUI DataGrid                              │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 3. USER KLIK "TAMBAH KOLEKSI"                              │
│    - Modal dialog terbuka                                  │
│    - Form fields:                                          │
│      * Pilih Pengepul (dropdown)                           │
│      * Tanggal (date picker)                               │
│      * Jumlah Pagi (number)                                │
│      * Jumlah Sore (number)                                │
│      * Harga per Liter (number)                            │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 4. VALIDASI FRONTEND                                       │
│    - React Hook Form + Zod validation                      │
│    - Minimal 1 waktu harus diisi (pagi/sore > 0)           │
│    - Semua field required terisi                           │
│    - Format number valid                                   │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 5. SUBMIT → POST /api/collections                          │
│    Request Body:                                           │
│    {                                                       │
│      collector_id: 1,                                      │
│      date: "2025-11-22",                                   │
│      morning_amount: 25.5,                                 │
│      afternoon_amount: 0,                                  │
│      price_per_liter: 3000                                 │
│    }                                                       │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 6. BACKEND PROCESSING                                      │
│    a. Auth middleware verify token                         │
│    b. Express-validator validate input                     │
│    c. Check collector exists                               │
│    d. Check duplicate (same collector, date, time)         │
│    e. Jika valid → INSERT ke database                      │
│    f. Auto calculate:                                      │
│       total_amount = morning + afternoon                   │
│       total_income = total_amount × price_per_liter        │
│    g. Return success + data                                │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 7. FRONTEND UPDATE                                         │
│    a. Close modal                                          │
│    b. Show success notification (SweetAlert2)              │
│    c. Refresh DataGrid (re-fetch data)                     │
│    d. Scroll to new record                                 │
└────────────────────────────────────────────────────────────┘
```

---

### **FLOW 3: Laporan Bulanan**

```
┌────────────────────────────────────────────────────────────┐
│ 1. USER BUKA HALAMAN LAPORAN                               │
│    /reports                                                │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 2. FETCH AVAILABLE MONTHS                                  │
│    GET /api/reports/available-months                       │
│    Response: [{year: 2025, month: 11}, ...]               │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 3. USER SELECT BULAN & TAHUN                               │
│    - Dropdown month & year                                 │
│    - Klik "Lihat Laporan"                                  │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 4. FETCH REPORT DATA                                       │
│    GET /api/reports/monthly?month=11&year=2025             │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 5. BACKEND GENERATE REPORT                                 │
│    Parallel Queries ke Database:                           │
│    ┌─────────────────────────────────────────────┐        │
│    │ a. Koleksi Susu per Pengepul                │        │
│    │    SUM, AVG, COUNT by collector_id          │        │
│    ├─────────────────────────────────────────────┤        │
│    │ b. Absensi Karyawan                         │        │
│    │    COUNT by status per employee             │        │
│    ├─────────────────────────────────────────────┤        │
│    │ c. Gaji Karyawan                            │        │
│    │    final_salary per employee                │        │
│    ├─────────────────────────────────────────────┤        │
│    │ d. Pemasukan (incomes)                      │        │
│    │    List + SUM(amount)                       │        │
│    ├─────────────────────────────────────────────┤        │
│    │ e. Pengeluaran (expenses)                   │        │
│    │    List + SUM(amount)                       │        │
│    ├─────────────────────────────────────────────┤        │
│    │ f. Pemeliharaan (maintenances)              │        │
│    │    List + SUM(cost)                         │        │
│    ├─────────────────────────────────────────────┤        │
│    │ g. Pengiriman (shipments)                   │        │
│    │    List + SUM(amount)                       │        │
│    └─────────────────────────────────────────────┘        │
│                                                            │
│    Calculate Summary:                                      │
│    netIncome = (totalIncome + totalMilkValue)              │
│              - (totalExpense + totalMaintenance            │
│                 + totalSalary)                             │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 6. DISPLAY REPORT                                          │
│    - Tabel per kategori (MUI Table)                        │
│    - Summary cards dengan total                            │
│    - Visualisasi dengan Recharts                           │
│    - Button "Export PDF"                                   │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 7. USER KLIK "EXPORT PDF"                                  │
│    - jsPDF generate document                               │
│    - jspdf-autotable format tables                         │
│    - Header: Logo + Periode                                │
│    - Content: All tables                                   │
│    - Footer: Summary                                       │
│    - Download PDF                                          │
└────────────────────────────────────────────────────────────┘
```

---

### **FLOW 4: Perhitungan Gaji Otomatis**

```
┌────────────────────────────────────────────────────────────┐
│ 1. USER DI HALAMAN ABSENSI                                 │
│    - Klik "Hitung Gaji Bulan Ini"                          │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 2. FRONTEND REQUEST                                        │
│    POST /api/attendances/salaries/calculate                │
│    Body: { month: 11, year: 2025 }                         │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 3. BACKEND CALCULATION PROCESS                             │
│    For each employee:                                      │
│    ┌─────────────────────────────────────────────┐        │
│    │ a. Get employee base_salary                 │        │
│    ├─────────────────────────────────────────────┤        │
│    │ b. Query attendances for month/year         │        │
│    │    COUNT(status='hadir') as present_days    │        │
│    │    COUNT(status='ijin') as absent_days      │        │
│    │    COUNT(status='sakit') as sick_days       │        │
│    │    COUNT(status='libur') as holiday_days    │        │
│    ├─────────────────────────────────────────────┤        │
│    │ c. Calculate                                │        │
│    │    total_working_days = present + sick      │        │
│    │    salary_per_day = base / total_working    │        │
│    │    total_salary = present × salary_per_day  │        │
│    │    final_salary = total - deductions        │        │
│    │                         + bonuses            │        │
│    ├─────────────────────────────────────────────┤        │
│    │ d. INSERT/UPDATE employee_salaries          │        │
│    │    (use UNIQUE constraint month+year)       │        │
│    └─────────────────────────────────────────────┘        │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 4. RETURN RESULT                                           │
│    - Success message                                       │
│    - Summary: X karyawan berhasil dihitung                 │
│    - Total gaji yang dibayarkan                            │
└────────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 5. FRONTEND DISPLAY                                        │
│    - Success notification                                  │
│    - Option untuk lihat detail di laporan bulanan          │
└────────────────────────────────────────────────────────────┘
```

---

## 📡 API ENDPOINTS LENGKAP

### **Summary Table**

| Modul | Jumlah Endpoints | Fitur Khusus |
|-------|------------------|--------------|
| Authentication | 5 | Login, Register, Logout, Reset, Me |
| Collectors | 6 | CRUD + Stats |
| Collections | 8 | CRUD + Export Excel + Bulk Delete |
| Employees | 6 | CRUD + Detail with Summary |
| Attendances | 7 | CRUD + Bulk Create + Salary Calc |
| Incomes | 5 | CRUD + Upload |
| Expenses | 5 | CRUD + Upload |
| Maintenances | 5 | CRUD + Upload |
| Shipments | 5 | CRUD |
| Dashboard | 11 | Stats + Charts |
| Reports | 2 | Monthly Report |

**Total: 65 API Endpoints**

---

## 🔐 KEAMANAN & AUTENTIKASI

### **1. Password Security**

**Hashing Algorithm:** bcrypt
**Salt Rounds:** 10

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Hash Example:**
```
Input:  admin123
Output: $2a$10$N9qo8uLOickgx2ZMRZoMye.IjefO7Z/hjZxcvZcRZ/.JM9JrxKk7m
```

---

### **2. JWT Token**

**Algorithm:** HS256
**Expiry:** 30 minutes
**Secret:** Dari environment variable `JWT_SECRET`

**Token Payload:**
```javascript
{
  userId: 1,
  username: "admin",
  iat: 1700000000,        // Issued at
  exp: 1700001800,        // Expires at
  type: "access"
}
```

**Verification Process:**
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Check:
// - Token not expired
// - Type = 'access'
// - User exists in database
// - Token not blacklisted
```

---

### **3. Middleware Auth**

**File:** `middleware/auth.js`

**Security Checks:**
1. ✅ Token format validation
2. ✅ JWT signature verification
3. ✅ Token expiry check
4. ✅ Blacklist check (logout tokens)
5. ✅ User existence check in database
6. ✅ Additional payload validation

**Error Responses:**
- 401: No token / Invalid token / Expired
- 500: JWT_SECRET not configured

---

### **4. Rate Limiting**

**Login Endpoint:**
- Max attempts: **5 per 15 minutes**
- Per IP address
- Simple in-memory store (production: use Redis)

```javascript
const loginRateLimit = (req, res, next) => {
  const ip = req.ip;
  const attempts = loginAttempts.get(ip);

  if (attempts >= 5) {
    return res.status(429).json({
      message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.'
    });
  }

  next();
};
```

---

### **5. Input Validation**

**Library:** express-validator

**Example:**
```javascript
body('username')
  .notEmpty().withMessage('Username required')
  .isLength({ min: 3, max: 50 })
  .matches(/^[a-zA-Z0-9_]+$/).withMessage('Only alphanumeric + underscore'),

body('password')
  .isLength({ min: 6, max: 100 })
```

**Validation Types:**
- Required fields
- String length
- Number range
- Email format
- Phone format
- Date format
- Regex patterns

---

### **6. File Upload Security**

**Library:** Multer

**Validations:**
```javascript
// Max file size
limits: { fileSize: 5 * 1024 * 1024 } // 5MB

// Allowed file types
const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

if (!allowedTypes.includes(file.mimetype)) {
  return cb(new Error('Invalid file type'));
}
```

**Filename Sanitization:**
```javascript
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
const filename = 'income-' + uniqueSuffix + path.extname(file.originalname);
```

---

### **7. CORS Configuration**

```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true
}));
```

**For Production:** Ganti dengan domain yang sesuai

---

### **8. Session Timeout**

**Frontend (AuthContext.tsx):**
- **Idle Timeout:** 10 minutes
- **Activity Tracking:** mouse, keyboard, scroll, touch, click
- **Auto Logout:** Jika tidak ada aktivitas selama 10 menit

```javascript
const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

const checkInactivity = setInterval(() => {
  if (Date.now() - lastActivity >= IDLE_TIMEOUT) {
    logout();
  }
}, 30000); // Check every 30 seconds
```

---

## 🔀 FLOW DIAGRAM

### **Data Flow Architecture**

```
┌──────────────┐
│   Browser    │
│  (ReactApp)  │
└──────┬───────┘
       │
       │ 1. User Action (Click, Submit, etc)
       ↓
┌──────────────────────────┐
│  React Component State   │
│  (useState, useContext)  │
└──────┬───────────────────┘
       │
       │ 2. API Call via Axios
       ↓
┌──────────────────────────────────┐
│  Axios HTTP Client               │
│  - Base URL: http://localhost:5000│
│  - Headers: Authorization Bearer │
│  - Content-Type: application/json│
└──────┬───────────────────────────┘
       │
       │ 3. HTTP Request (GET/POST/PUT/DELETE)
       ↓
┌──────────────────────────────────┐
│  Express Server (Port 5000)      │
│  ┌────────────────────────────┐ │
│  │  Middleware Stack          │ │
│  │  1. CORS                   │ │
│  │  2. Body Parser (if JSON)  │ │
│  │  3. Multer (if file)       │ │
│  │  4. Auth (if protected)    │ │
│  │  5. Validation             │ │
│  └────────────────────────────┘ │
└──────┬───────────────────────────┘
       │
       │ 4. Route Handler
       ↓
┌──────────────────────────────────┐
│  Route File (e.g., collections.js)│
│  - Business Logic                │
│  - Data Processing               │
└──────┬───────────────────────────┘
       │
       │ 5. Database Query
       ↓
┌──────────────────────────────────┐
│  MySQL Database                  │
│  db.promise().query(sql, params) │
└──────┬───────────────────────────┘
       │
       │ 6. Query Result
       ↑
┌──────────────────────────────────┐
│  Route Handler                   │
│  - Format Response               │
│  - Send JSON                     │
└──────┬───────────────────────────┘
       │
       │ 7. HTTP Response
       ↑
┌──────────────────────────────────┐
│  Axios Response Handler          │
│  - Success: Update state         │
│  - Error: Show notification      │
└──────┬───────────────────────────┘
       │
       │ 8. Update UI
       ↑
┌──────────────┐
│  React       │
│  Component   │
│  Re-render   │
└──────────────┘
```

---

## 📚 DEPENDENCY & LIBRARY

### **Backend Dependencies**

```json
{
  "bcryptjs": "^2.4.3",           // Password hashing
  "cors": "^2.8.5",               // Cross-Origin Resource Sharing
  "dotenv": "^16.3.1",            // Environment variables
  "exceljs": "^4.4.0",            // Excel file generation
  "express": "^4.18.2",           // Web framework
  "express-validator": "^7.0.1",  // Input validation
  "jsonwebtoken": "^9.0.2",       // JWT authentication
  "moment": "^2.29.4",            // Date formatting
  "mysql2": "^3.6.5"              // MySQL driver
}
```

**Dev Dependencies:**
```json
{
  "nodemon": "^3.0.2"             // Auto-restart server
}
```

---

### **Frontend Dependencies**

```json
{
  "@emotion/react": "^11.13.0",   // CSS-in-JS
  "@emotion/styled": "^11.13.0",  // Styled components
  "@hookform/resolvers": "^3.9.0",// Form validation resolver
  "@mui/icons-material": "^5.15.20", // Material icons
  "@mui/lab": "^5.0.0-alpha.170", // MUI lab components
  "@mui/material": "^5.15.20",    // Material-UI components
  "@tanstack/react-query": "^5.51.1", // Data fetching
  "axios": "^1.7.7",              // HTTP client
  "dayjs": "^1.11.13",            // Date library
  "jspdf": "^2.5.1",              // PDF generation
  "jspdf-autotable": "^3.8.2",    // PDF tables
  "jwt-decode": "^4.0.0",         // JWT decoder
  "notistack": "^3.0.1",          // Notifications
  "react": "^18.3.1",             // React library
  "react-dom": "^18.3.1",         // React DOM
  "react-hook-form": "^7.53.0",   // Form management
  "react-router-dom": "^6.26.2",  // Routing
  "recharts": "^2.13.0",          // Charts library
  "sweetalert2": "^11.23.0",      // Alerts/Modals
  "zod": "^3.23.8"                // Schema validation
}
```

**Dev Dependencies:**
```json
{
  "@types/node": "^20.14.10",
  "@types/react": "^18.3.5",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.1",
  "typescript": "^5.5.4",
  "vite": "^5.4.1"
}
```

---

## 🎨 UI/UX COMPONENTS

### **Material-UI Components Used:**

1. **Layout Components:**
   - `AppBar` - Top navigation
   - `Drawer` - Sidebar menu
   - `Box` - Layout container
   - `Container` - Content wrapper
   - `Grid` - Responsive grid

2. **Data Display:**
   - `DataGrid` - Advanced table (@mui/x-data-grid)
   - `Table` - Simple table
   - `Card` - Content cards
   - `Typography` - Text styling
   - `Chip` - Status badges

3. **Input Components:**
   - `TextField` - Text input
   - `Select` - Dropdown
   - `DatePicker` - Date selection
   - `Button` - Action buttons
   - `IconButton` - Icon buttons
   - `Switch` - Toggle switch

4. **Feedback:**
   - `Dialog` - Modal dialogs
   - `Snackbar` - Notifications
   - `CircularProgress` - Loading spinner
   - `Alert` - Alert messages

5. **Charts (Recharts):**
   - `LineChart` - Trend lines
   - `BarChart` - Bar graphs
   - `PieChart` - Pie charts
   - `AreaChart` - Area graphs

---

## 📊 STATISTIK KODE

### **Lines of Code Estimation:**

| Komponen | File Count | Lines of Code |
|----------|------------|---------------|
| Backend Routes | 11 | ~3,500 |
| Backend Middleware | 2 | ~200 |
| Frontend Pages | 11 | ~4,000 |
| Frontend Components | 4 | ~800 |
| Frontend Utils | 2 | ~300 |
| Database SQL | 1 | ~500 |
| Config Files | 5 | ~200 |
| **TOTAL** | **36** | **~9,500** |

---

## 🚀 TEKNOLOGI TERKINI YANG DIGUNAKAN

### **Modern Development Stack:**

1. ✅ **TypeScript** - Type-safe JavaScript
2. ✅ **React Hooks** - Modern state management
3. ✅ **Async/Await** - Modern asynchronous code
4. ✅ **ES6+ Syntax** - Arrow functions, destructuring, spread operator
5. ✅ **Promise-based MySQL** - db.promise().query()
6. ✅ **Vite** - Next-generation frontend tooling
7. ✅ **Material-UI v5** - Latest UI framework
8. ✅ **React Router v6** - Modern routing
9. ✅ **JWT** - Stateless authentication
10. ✅ **RESTful API** - Industry standard

---

## 📝 KESIMPULAN

### **Sistem Manajemen Koperasi Susu** ini adalah aplikasi **Full Stack Web Application** yang dibangun dengan:

**Backend:**
- **Bahasa:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **Security:** bcrypt, rate limiting, validation

**Frontend:**
- **Bahasa:** TypeScript
- **Library:** React 18
- **UI Framework:** Material-UI (MUI)
- **Build Tool:** Vite
- **State Management:** Context API + React Query
- **Routing:** React Router v6

**Fitur Utama:**
- 10 Modul manajemen lengkap
- 65+ API endpoints
- Dashboard real-time
- Laporan bulanan komprehensif
- Export Excel & PDF
- Upload file untuk bukti transaksi
- Autentikasi & session management
- Responsive design

**Deployment:**
- **Local:** Laragon (Windows)
- **Server:** Node.js (Port 5000)
- **Client:** Vite Preview (Port 5173)
- **Database:** MySQL (Port 3306)

---

**Dibuat pada:** November 2025
**Versi Aplikasi:** 1.0.0
**Dokumentasi:** Lengkap
**Status:** Production Ready ✅

---
