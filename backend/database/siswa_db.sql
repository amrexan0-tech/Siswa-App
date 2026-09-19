-- ============================================================
-- Sistem Informasi Data Siswa - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS siswa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE siswa_db;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel kelas
CREATE TABLE IF NOT EXISTS kelas (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nama_kelas VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabel jurusan
CREATE TABLE IF NOT EXISTS jurusan (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nama_jurusan VARCHAR(100) NOT NULL,
    kode         VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabel tahun_ajaran
CREATE TABLE IF NOT EXISTS tahun_ajaran (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    tahun VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabel siswa
CREATE TABLE IF NOT EXISTS siswa (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nis              VARCHAR(20) NOT NULL UNIQUE,
    nama             VARCHAR(100) NOT NULL,
    alamat           TEXT,
    no_hp            VARCHAR(20),
    foto             VARCHAR(255),
    kelas_id         INT NOT NULL,
    jurusan_id       INT NOT NULL,
    tahun_ajaran_id  INT NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kelas_id)        REFERENCES kelas(id)        ON DELETE RESTRICT,
    FOREIGN KEY (jurusan_id)      REFERENCES jurusan(id)      ON DELETE RESTRICT,
    FOREIGN KEY (tahun_ajaran_id) REFERENCES tahun_ajaran(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Tabel activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    aktivitas  TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- Data Awal (Seed)
-- ============================================================

-- Admin default: username=admin, password=admin123
INSERT INTO users (username, password, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('staff1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff');

-- Kelas
INSERT INTO kelas (nama_kelas) VALUES ('X'), ('XI'), ('XII');

-- Jurusan
INSERT INTO jurusan (nama_jurusan, kode) VALUES
('Rekayasa Perangkat Lunak', 'RPL'),
('Teknik Komputer dan Jaringan', 'TKJ'),
('Multimedia', 'MM'),
('Akuntansi', 'AK'),
('Administrasi Perkantoran', 'AP');

-- Tahun Ajaran
INSERT INTO tahun_ajaran (tahun) VALUES
('2022/2023'), ('2023/2024'), ('2024/2025');

-- Sample Siswa
INSERT INTO siswa (nis, nama, alamat, no_hp, kelas_id, jurusan_id, tahun_ajaran_id) VALUES
('2024001', 'Ahmad Fauzi', 'Jl. Merdeka No. 1, Jakarta', '081234567890', 1, 1, 3),
('2024002', 'Siti Rahayu', 'Jl. Sudirman No. 5, Bandung', '082345678901', 1, 2, 3),
('2024003', 'Budi Santoso', 'Jl. Gatot Subroto No. 10, Surabaya', '083456789012', 2, 1, 3),
('2024004', 'Dewi Lestari', 'Jl. Ahmad Yani No. 15, Yogyakarta', '084567890123', 2, 3, 3),
('2024005', 'Rizky Pratama', 'Jl. Diponegoro No. 20, Semarang', '085678901234', 3, 2, 3),
('2024006', 'Nur Hidayah', 'Jl. Imam Bonjol No. 25, Medan', '086789012345', 1, 1, 3),
('2024007', 'Eko Wahyudi', 'Jl. Pahlawan No. 30, Makassar', '087890123456', 3, 3, 3),
('2024008', 'Fitri Handayani', 'Jl. Veteran No. 35, Palembang', '088901234567', 2, 2, 3),
('2024009', 'Hendra Gunawan', 'Jl. Pemuda No. 40, Denpasar', '089012345678', 1, 4, 3),
('2024010', 'Indah Permata', 'Jl. Kartini No. 45, Balikpapan', '081123456789', 3, 5, 3),
('2023001', 'Joko Susilo', 'Jl. Raya No. 50, Malang', '082234567890', 2, 1, 2),
('2023002', 'Kartika Sari', 'Jl. Utama No. 55, Pekanbaru', '083345678901', 3, 2, 2);

-- Sample Activity Logs
INSERT INTO activity_logs (user_id, aktivitas) VALUES
(1, 'Login berhasil'),
(1, 'Tambah siswa: Ahmad Fauzi (NIS: 2024001)'),
(1, 'Tambah siswa: Siti Rahayu (NIS: 2024002)'),
(2, 'Login berhasil'),
(2, 'Tambah siswa: Budi Santoso (NIS: 2024003)');
