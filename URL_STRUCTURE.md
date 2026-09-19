# 🌐 Struktur URL - SiSiswa

## 📍 URL Mapping

### Frontend (React)
```
http://localhost:5173
├── /login              → LoginPage
├── /                   → DashboardPage (protected)
├── /siswa              → SiswaPage (protected)
├── /kelas              → KelasPage (protected)
├── /jurusan            → JurusanPage (protected)
├── /tahun-ajaran       → TahunAjaranPage (protected)
├── /users              → UsersPage (protected, admin only)
├── /activity           → ActivityPage (protected)
└── /profile            → ProfilePage (protected)
```

---

### Backend (PHP)
```
http://localhost/siswa-app/backend/public
├── /test               → TestController
├── /auth               → AuthController
├── /siswa              → SiswaController
├── /kelas              → KelasController
├── /jurusan            → JurusanController
├── /tahun-ajaran       → TahunAjaranController
├── /users              → UserController
├── /activity-logs      → ActivityLogController
├── /dashboard          → DashboardController
├── /upload             → UploadController
├── /export             → ExportController
└── /import             → ImportController
```

---

## 🔗 Request Flow

### Login Flow
```
┌─────────────────────────────────────────────────────────────┐
│ 1. User mengisi form login di frontend                      │
│    URL: http://localhost:5173/login                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend kirim POST request                              │
│    URL: http://localhost/siswa-app/backend/public/auth      │
│    Body: { action: "login", username: "admin",              │
│           password: "password" }                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend routing (App.php)                                │
│    Parse URL: /auth → AuthController                        │
│    HTTP Method: POST → postAll()                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. AuthController@postAll()                                 │
│    - Ambil body JSON                                        │
│    - Cek action = "login"                                   │
│    - Panggil method login()                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. AuthController@login()                                   │
│    - Validasi username & password                           │
│    - Query database via UserModel                           │
│    - Verify password dengan password_verify()               │
│    - Simpan user ke $_SESSION['user']                       │
│    - Return JSON response                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Response ke frontend                                     │
│    { success: true, message: "Login berhasil",              │
│      data: { id: 1, username: "admin", role: "admin" } }    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Frontend handle response                                 │
│    - Simpan user ke AuthContext                             │
│    - Redirect ke dashboard (/)                              │
│    - Tampilkan toast success                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints Detail

### Auth Endpoints
```
GET  /auth
     → Check session status
     → Response: { success: true, data: { user } }
     
POST /auth
     Body: { action: "login", username: "...", password: "..." }
     → Login user
     → Response: { success: true, data: { user } }
     
POST /auth
     Body: { action: "logout" }
     → Logout user
     → Response: { success: true, message: "Logout berhasil" }
```

### Siswa Endpoints
```
GET    /siswa?page=1&limit=10&search=...
       → Get all siswa with pagination
       
GET    /siswa/{id}
       → Get one siswa by ID
       
POST   /siswa
       Body: { nis, nama, alamat, no_hp, kelas_id, ... }
       → Create new siswa
       
PUT    /siswa/{id}
       Body: { nama, alamat, ... }
       → Update siswa
       
DELETE /siswa/{id}
       → Delete siswa
```

### Kelas Endpoints
```
GET    /kelas
       → Get all kelas
       
POST   /kelas
       Body: { nama_kelas }
       → Create new kelas
       
PUT    /kelas/{id}
       Body: { nama_kelas }
       → Update kelas
       
DELETE /kelas/{id}
       → Delete kelas
```

### Dashboard Endpoint
```
GET    /dashboard
       → Get statistics
       → Response: { total_siswa, total_kelas, ... }
```

---

## 🔧 URL Configuration

### Backend `.env`
```env
# Base URL backend (untuk generate link upload, dll)
APP_URL=http://localhost/siswa-app/backend/public

# Frontend URL (untuk CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
# Base URL API (tanpa /api di akhir!)
VITE_API_URL=http://localhost/siswa-app/backend/public
```

---

## 🚨 Common Mistakes

### ❌ SALAH
```env
# Frontend .env
VITE_API_URL=http://localhost/siswa-app/backend/public/api
```
**Masalah:** Request akan menjadi `/api/auth` yang tidak ada di routing.

### ✅ BENAR
```env
# Frontend .env
VITE_API_URL=http://localhost/siswa-app/backend/public
```
**Alasan:** Routing backend sudah handle `/auth`, `/siswa`, dll.

---

### ❌ SALAH
```javascript
// api.js
api.post('/api/auth', data)
```
**Masalah:** Double `/api` prefix.

### ✅ BENAR
```javascript
// api.js
api.post('/auth', data)
```
**Alasan:** baseURL sudah include domain, tinggal tambah path.

---

## 🧪 Testing URLs

### Test Backend Running
```
http://localhost/siswa-app/backend/public/test
```
**Expected:** JSON response dengan info backend

### Test Auth Endpoint
```
http://localhost/siswa-app/backend/public/auth
```
**Expected:** JSON response (401 jika belum login)

### Test Frontend
```
http://localhost:5173
```
**Expected:** Redirect ke `/login` jika belum login

---

## 📊 URL Rewriting

### .htaccess Configuration
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```

### How It Works
```
Request: /auth
         ↓
.htaccess: RewriteRule
         ↓
index.php?url=auth
         ↓
App.php: parseUrl() → ['auth']
         ↓
App.php: route() → AuthController
```

---

## 🔍 Debugging URLs

### Check Request URL
```javascript
// Frontend - api.js
api.interceptors.request.use(config => {
  console.log('Request URL:', config.baseURL + config.url)
  return config
})
```

### Check Backend Routing
```php
// Backend - App.php
private function parseUrl(): array {
    $url = $_GET['url'] ?? '';
    error_log("Routing: $url"); // Log ke error.log
    // ...
}
```

---

## 📝 Summary

| Component | URL | Port |
|-----------|-----|------|
| Frontend Dev Server | http://localhost:5173 | 5173 |
| Backend API | http://localhost/siswa-app/backend/public | 80 |
| phpMyAdmin | http://localhost/phpmyadmin | 80 |
| MySQL | localhost | 3306 |

**Key Points:**
- ✅ Frontend `.env` tidak boleh ada `/api` di akhir
- ✅ Backend routing handle path seperti `/auth`, `/siswa`
- ✅ CORS harus di-set untuk allow frontend URL
- ✅ Session harus di-start untuk authentication
- ✅ `.htaccess` diperlukan untuk URL rewriting
