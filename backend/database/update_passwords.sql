-- Update password untuk user admin dan staff1
-- Password baru: "password" (sesuai dengan demo credentials di LoginPage)
-- Hash dibuat dengan: password_hash('password', PASSWORD_DEFAULT)

USE siswa_db;

-- Update password admin dan staff1 menjadi "password"
-- Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi adalah hash untuk "password"
UPDATE users SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username IN ('admin', 'staff1');

-- Verifikasi
SELECT id, username, role, created_at FROM users;
