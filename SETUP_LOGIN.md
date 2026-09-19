# 🔧 Panduan Setup & Troubleshooting Login

## ✅ Checklist Setup

### 1. Backend Setup (PHP)

#### a. Pastikan XAMPP/Apache Berjalan
```bash
# Pastikan Apache sudah running di XAMPP Control Panel
# MySQL juga harus running
```

#### b. Import Database
```bash
# 1. Buka phpMyAdmin: http://localhost/phpmyadmin
# 2. Import file: backend/database/siswa_db.sql
# 3. Database "siswa_db" akan otomatis terbuat
```

#### c. Update Password (PENTING!)
```bash
# Jalankan script untuk generate password hash yang benar:
cd backend
php generate_password.php

# Atau jalankan SQL update:
# Import file: backend/database/update_passwords.sql di phpMyAdmin
```

#### d. Cek Konfigurasi .env
```env
# File: backend/.env
DB_HOST=localhost
DB_NAME=siswa_db
DB_USER=root
DB_PASS=
APP_ENV=development
APP_URL=http://localhost/siswa-app/backend/public
FRONTEND_URL=http://localhost:5173
```

#### e. Test Backend API
Buka browser dan akses:
```
http://localhost/siswa-app/backend/public/auth
```

Jika muncul JSON response (bukan error 404), backend sudah berjalan!

---

### 2. Frontend Setup (React)

#### a. Install Dependencies
```bash
cd frontend
npm install
```

#### b. Cek Konfigurasi .env
```env
# File: frontend/.env
VITE_API_URL=http://localhost/siswa-app/backend/public
```

**PENTING:** URL tidak boleh ada `/api` di akhir!

#### c. Jalankan Development Server
```bash
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

---

## 🔐 Kredensial Login

Setelah database di-import dan password di-update:

| Username | Password | Role  |
|----------|----------|-------|
| admin    | password | Admin |
| staff1   | password | Staff |

---

## 🐛 Troubleshooting

### Error: "Endpoint not found"

**Penyebab:**
- Backend tidak berjalan
- URL salah
- File .htaccess tidak berfungsi

**Solusi:**
1. Pastikan Apache sudah running
2. Cek URL backend: `http://localhost/siswa-app/backend/public/auth`
3. Pastikan mod_rewrite Apache aktif
4. Cek file `.htaccess` ada di folder `backend/public/`

---

### Error: "Username atau password salah"

**Penyebab:**
- Password hash tidak cocok
- Data user tidak ada di database

**Solusi:**
1. Jalankan script: `php backend/generate_password.php`
2. Update password di database dengan hash yang baru
3. Atau import ulang: `backend/database/update_passwords.sql`

---

### Error: CORS / Network Error

**Penyebab:**
- CORS header tidak di-set
- Frontend URL tidak sesuai

**Solusi:**
1. Cek `backend/.env` → `FRONTEND_URL=http://localhost:5173`
2. Restart Apache setelah ubah .env
3. Clear browser cache

---

### Error: "Cannot connect to database"

**Penyebab:**
- MySQL tidak running
- Kredensial database salah

**Solusi:**
1. Start MySQL di XAMPP
2. Cek `backend/.env` → DB_HOST, DB_NAME, DB_USER, DB_PASS
3. Test koneksi di phpMyAdmin

---

## 🧪 Testing Login

### 1. Test Backend API (Manual)

Gunakan Postman atau curl:

```bash
curl -X POST http://localhost/siswa-app/backend/public/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"login","username":"admin","password":"password"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "created_at": "..."
  }
}
```

---

### 2. Test Frontend Login

1. Buka: `http://localhost:5173/login`
2. Masukkan:
   - Username: `admin`
   - Password: `password`
3. Klik "Masuk"
4. Jika berhasil → redirect ke dashboard
5. Jika gagal → cek console browser (F12)

---

## 🔍 Debug Mode

### Backend Debug

Tambahkan di `backend/public/index.php` (setelah session_start):

```php
// Debug mode
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log semua request
file_put_contents('debug.log', date('Y-m-d H:i:s') . ' - ' . $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'] . "\n", FILE_APPEND);
```

### Frontend Debug

Buka Console Browser (F12) dan cek:
- Network tab → lihat request/response
- Console tab → lihat error JavaScript

---

## 📁 Struktur URL

| Komponen | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend Root | http://localhost/siswa-app/backend/public |
| API Endpoint | http://localhost/siswa-app/backend/public/auth |
| Login Endpoint | POST /auth (action: login) |

---

## ✨ Fitur Login

- ✅ Session-based authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS support
- ✅ Activity logging
- ✅ Role-based access (admin/staff)
- ✅ Auto-redirect jika sudah login
- ✅ Error handling & validation

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:

1. Cek file log: `backend/debug.log`
2. Cek console browser (F12)
3. Cek Network tab untuk melihat request/response
4. Pastikan semua service (Apache, MySQL) running
5. Restart Apache setelah ubah konfigurasi
