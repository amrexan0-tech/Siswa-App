# SiSiswa - Sistem Informasi Data Siswa

Dashboard SaaS modern untuk manajemen data siswa sekolah.

## Stack

- **Backend**: PHP Native (MVC, tanpa framework)
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: MySQL
- **API**: REST API (JSON)

---

## 🚀 Quick Start

### 1. Setup Backend (PHP)
```bash
# 1. Import database
# Buka phpMyAdmin → Import: backend/database/siswa_db.sql

# 2. Generate password hash yang benar
cd backend
php generate_password.php

# 3. Test koneksi database
php test_connection.php
# Atau buka: http://localhost/siswa-app/backend/test_connection.php

# 4. Test endpoint API
# Buka: http://localhost/siswa-app/backend/public/test
```

### 2. Setup Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 3. Login
- URL: http://localhost:5173/login
- Username: `admin`
- Password: `password`

---

## 🧪 Testing & Debugging

### Test Login (HTML Tool)
Buka file `test_login.html` di browser untuk test endpoint login secara interaktif dengan UI yang mudah.

### Test Manual (curl)
```bash
# Test endpoint
curl http://localhost/siswa-app/backend/public/test

# Test login
curl -X POST http://localhost/siswa-app/backend/public/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"login","username":"admin","password":"password"}'
```

### Troubleshooting
Jika ada masalah login, baca panduan lengkap di: **[SETUP_LOGIN.md](SETUP_LOGIN.md)**

---

## Cara Menjalankan

### 1. Setup Database

```sql
-- Import file SQL ke MySQL
mysql -u root -p < backend/database/siswa_db.sql
```

Atau buka phpMyAdmin dan import file `backend/database/siswa_db.sql`.

### 2. Konfigurasi Backend

Edit file `backend/.env`:

```env
DB_HOST=localhost
DB_NAME=siswa_db
DB_USER=root
DB_PASS=        # sesuaikan password MySQL Anda
APP_URL=http://localhost/siswa-app/backend/public
FRONTEND_URL=http://localhost:5173
```

Pastikan folder `backend/public/uploads/` bisa ditulis (writable).

### 3. Setup Web Server (Laragon / XAMPP)

Letakkan folder `siswa-app/` di dalam `www/` atau `htdocs/`.

Backend akan berjalan di: `http://localhost/siswa-app/backend/public/`

### 4. Konfigurasi Frontend

Edit file `frontend/.env`:

```env
VITE_API_URL=http://localhost/siswa-app/backend/public
```

**PENTING:** URL tidak boleh ada `/api` di akhir!

### 5. Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

---

## Akun Default

| Username | Password | Role  |
|----------|----------|-------|
| admin    | password | Admin |
| staff1   | password | Staff |

---

## Fitur

- Dashboard dengan statistik & chart
- CRUD Data Siswa (dengan foto upload)
- Filter & search realtime
- Export CSV & PDF
- Import CSV
- Manajemen Kelas, Jurusan, Tahun Ajaran
- Manage Users (admin only)
- Activity Log
- Edit Profil & Ganti Password
- Pagination
- Responsive (mobile friendly)

---

## Struktur Proyek

```
siswa-app/
├── backend/
│   ├── app/
│   │   ├── controllers/    # AuthController, SiswaController, dll
│   │   └── models/         # UserModel, SiswaModel, dll
│   ├── config/
│   │   └── database.php    # Koneksi PDO
│   ├── core/
│   │   ├── App.php         # Router
│   │   ├── BaseController.php
│   │   └── BaseModel.php
│   ├── database/
│   │   └── siswa_db.sql    # Schema + seed data
│   ├── public/
│   │   ├── index.php       # Entry point
│   │   ├── .htaccess
│   │   └── uploads/        # Foto siswa
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/     # Modal, Sidebar, Topbar, dll
    │   ├── context/        # AuthContext
    │   ├── layouts/        # DashboardLayout
    │   ├── pages/          # Semua halaman
    │   └── services/
    │       └── api.js      # Axios API calls
    ├── .env
    └── vite.config.js
```
