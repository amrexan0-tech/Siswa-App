-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 19, 2026 at 10:26 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `siswa_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `aktivitas` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `aktivitas`, `created_at`) VALUES
(1, 1, 'Login berhasil', '2026-04-24 05:51:20'),
(2, 1, 'Tambah siswa: Ahmad Fauzi (NIS: 2024001)', '2026-04-24 05:51:20'),
(3, 1, 'Tambah siswa: Siti Rahayu (NIS: 2024002)', '2026-04-24 05:51:20'),
(4, 2, 'Login berhasil', '2026-04-24 05:51:20'),
(5, 2, 'Tambah siswa: Budi Santoso (NIS: 2024003)', '2026-04-24 05:51:20'),
(6, 1, 'Login berhasil', '2026-04-24 05:56:16'),
(7, 1, 'Login berhasil', '2026-04-24 05:56:21'),
(8, 1, 'Login berhasil', '2026-04-24 05:56:23'),
(9, 1, 'Login berhasil', '2026-04-24 05:56:25'),
(10, 1, 'Login berhasil', '2026-04-24 05:56:26'),
(11, 1, 'Login berhasil', '2026-04-24 05:56:27'),
(12, 1, 'Login berhasil', '2026-04-24 05:56:28'),
(13, 1, 'Login berhasil', '2026-04-24 05:56:29'),
(14, 1, 'Login berhasil', '2026-04-24 05:56:30'),
(15, 1, 'Login berhasil', '2026-04-24 05:56:45'),
(16, 1, 'Login berhasil', '2026-04-24 05:56:47'),
(17, 1, 'Login berhasil', '2026-04-24 05:56:48'),
(18, 1, 'Login berhasil', '2026-04-24 05:56:49'),
(19, 1, 'Login berhasil', '2026-04-24 05:56:50'),
(20, 1, 'Login berhasil', '2026-04-24 05:56:52'),
(21, 1, 'Login berhasil', '2026-04-24 05:57:05'),
(22, 1, 'Login berhasil', '2026-04-24 05:57:06'),
(23, 1, 'Login berhasil', '2026-04-24 05:57:07'),
(24, 1, 'Login berhasil', '2026-04-24 05:57:08'),
(25, 1, 'Login berhasil', '2026-04-24 06:05:29'),
(26, 1, 'Login berhasil', '2026-04-24 06:05:31'),
(27, 1, 'Login berhasil', '2026-04-24 06:06:47'),
(28, 1, 'Login berhasil', '2026-04-24 06:06:49'),
(29, 1, 'Login berhasil', '2026-04-24 06:06:51'),
(30, 1, 'Login berhasil', '2026-04-24 06:06:53'),
(31, 1, 'Login berhasil', '2026-04-24 06:08:09'),
(32, 1, 'Login berhasil', '2026-04-24 06:08:11'),
(33, 1, 'Login berhasil', '2026-04-24 06:12:31'),
(34, 1, 'Login berhasil', '2026-04-24 06:12:33'),
(35, 1, 'Login berhasil', '2026-04-24 06:13:54'),
(36, 1, 'Login berhasil', '2026-04-24 06:13:56'),
(37, 1, 'Login berhasil', '2026-04-24 06:14:40'),
(38, 1, 'Login berhasil', '2026-04-24 06:14:41'),
(39, 1, 'Login berhasil', '2026-04-24 06:14:43'),
(40, 1, 'Login berhasil', '2026-04-24 06:14:45'),
(41, 1, 'Login berhasil', '2026-04-24 06:15:39'),
(42, 1, 'Login berhasil', '2026-04-24 06:15:42'),
(43, 1, 'Login berhasil', '2026-04-24 06:15:44'),
(44, 1, 'Login berhasil', '2026-04-24 06:15:47'),
(45, 1, 'Login berhasil', '2026-04-24 06:16:08'),
(46, 1, 'Login berhasil', '2026-04-24 06:16:10'),
(47, 1, 'Login berhasil', '2026-04-24 06:16:12'),
(48, 1, 'Login berhasil', '2026-04-24 06:19:33'),
(49, 1, 'Login berhasil', '2026-04-24 06:19:36'),
(50, 1, 'Login berhasil', '2026-04-24 06:20:01'),
(51, 1, 'Login berhasil', '2026-04-24 06:30:08'),
(52, 1, 'Login berhasil', '2026-04-24 06:46:59'),
(53, 1, 'Login berhasil', '2026-04-24 07:04:23'),
(54, 1, 'Import CSV: 0 berhasil, 120 gagal', '2026-04-24 10:26:42'),
(55, 1, 'Import CSV: 0 berhasil, 120 gagal', '2026-04-24 10:27:20'),
(56, 1, 'Update jurusan ID 5', '2026-04-24 10:30:43'),
(57, 1, 'Update jurusan ID 3', '2026-04-24 10:31:10'),
(58, 1, 'Update user ID 2', '2026-04-24 10:32:29'),
(59, 2, 'Login berhasil', '2026-04-24 10:32:37'),
(60, 1, 'Login berhasil', '2026-04-24 10:33:13'),
(61, 1, 'Import CSV: 0 berhasil, 120 gagal', '2026-04-24 10:33:31'),
(62, 1, 'Import CSV: 68 berhasil, 52 gagal', '2026-04-24 10:45:15'),
(63, 1, 'Login berhasil', '2026-04-28 07:30:47'),
(64, 1, 'Login berhasil', '2026-09-17 08:38:52');

-- --------------------------------------------------------

--
-- Table structure for table `jurusan`
--

CREATE TABLE `jurusan` (
  `id` int NOT NULL,
  `nama_jurusan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jurusan`
--

INSERT INTO `jurusan` (`id`, `nama_jurusan`, `kode`) VALUES
(1, 'Rekayasa Perangkat Lunak', 'RPL'),
(2, 'Teknik Komputer dan Jaringan', 'TKJ'),
(3, 'Desain Komunikasi Visual', 'DKV'),
(4, 'Akuntansi', 'AK'),
(5, 'Manajemen Perkantoran', 'MP');

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` int NOT NULL,
  `nama_kelas` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `nama_kelas`) VALUES
(1, 'X'),
(2, 'XI'),
(3, 'XII');

-- --------------------------------------------------------

--
-- Table structure for table `siswa`
--

CREATE TABLE `siswa` (
  `id` int NOT NULL,
  `nis` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `no_hp` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelas_id` int NOT NULL,
  `jurusan_id` int NOT NULL,
  `tahun_ajaran_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `siswa`
--

INSERT INTO `siswa` (`id`, `nis`, `nama`, `alamat`, `no_hp`, `foto`, `kelas_id`, `jurusan_id`, `tahun_ajaran_id`, `created_at`) VALUES
(1, '2024001', 'Ahmad Fauzi', 'Jl. Merdeka No. 1, Jakarta', '081234567890', NULL, 1, 1, 3, '2026-04-24 05:51:20'),
(2, '2024002', 'Siti Rahayu', 'Jl. Sudirman No. 5, Bandung', '082345678901', NULL, 1, 2, 3, '2026-04-24 05:51:20'),
(3, '2024003', 'Budi Santoso', 'Jl. Gatot Subroto No. 10, Surabaya', '083456789012', NULL, 2, 1, 3, '2026-04-24 05:51:20'),
(4, '2024004', 'Dewi Lestari', 'Jl. Ahmad Yani No. 15, Yogyakarta', '084567890123', NULL, 2, 3, 3, '2026-04-24 05:51:20'),
(5, '2024005', 'Rizky Pratama', 'Jl. Diponegoro No. 20, Semarang', '085678901234', NULL, 3, 2, 3, '2026-04-24 05:51:20'),
(6, '2024006', 'Nur Hidayah', 'Jl. Imam Bonjol No. 25, Medan', '086789012345', NULL, 1, 1, 3, '2026-04-24 05:51:20'),
(7, '2024007', 'Eko Wahyudi', 'Jl. Pahlawan No. 30, Makassar', '087890123456', NULL, 3, 3, 3, '2026-04-24 05:51:20'),
(8, '2024008', 'Fitri Handayani', 'Jl. Veteran No. 35, Palembang', '088901234567', NULL, 2, 2, 3, '2026-04-24 05:51:20'),
(9, '2024009', 'Hendra Gunawan', 'Jl. Pemuda No. 40, Denpasar', '089012345678', NULL, 1, 4, 3, '2026-04-24 05:51:20'),
(10, '2024010', 'Indah Permata', 'Jl. Kartini No. 45, Balikpapan', '081123456789', NULL, 3, 5, 3, '2026-04-24 05:51:20'),
(11, '2023001', 'Joko Susilo', 'Jl. Raya No. 50, Malang', '082234567890', NULL, 2, 1, 2, '2026-04-24 05:51:20'),
(12, '2023002', 'Kartika Sari', 'Jl. Utama No. 55, Pekanbaru', '083345678901', NULL, 3, 2, 2, '2026-04-24 05:51:20'),
(13, '2026001', 'Vina Wijaya', 'Sukamaju', '87799519023', NULL, 2, 2, 3, '2026-04-24 10:45:14'),
(14, '2026002', 'Fitri Maulana', 'Karanganyar', '83638330698', NULL, 2, 5, 3, '2026-04-24 10:45:14'),
(15, '2026003', 'Gina Rahmawati', 'Sukamaju', '85246946630', NULL, 2, 5, 3, '2026-04-24 10:45:14'),
(16, '2026004', 'Lestari Wijaya', 'Sukamaju', '83687257953', NULL, 3, 4, 3, '2026-04-24 10:45:14'),
(17, '2026005', 'Dewi Rahmawati', 'Tanjungjaya', '86968346879', NULL, 3, 3, 3, '2026-04-24 10:45:14'),
(18, '2026006', 'Xenia Permata', 'Tanjungjaya', '82379570778', NULL, 1, 4, 3, '2026-04-24 10:45:14'),
(19, '2026007', 'Joko Saputra', 'Karanganyar', '89415560594', NULL, 2, 5, 3, '2026-04-24 10:45:14'),
(20, '2026008', 'Citra Maulana', 'Karanganyar', '82701244003', NULL, 3, 3, 3, '2026-04-24 10:45:14'),
(21, '2026012', 'Putra Nugroho', 'Sukamaju', '86013410187', NULL, 3, 1, 3, '2026-04-24 10:45:14'),
(22, '2026013', 'Eko Hidayat', 'Sukamaju', '82399303916', NULL, 3, 1, 3, '2026-04-24 10:45:14'),
(23, '2026014', 'Gina Rahmawati', 'Tanjungjaya', '84349932772', NULL, 3, 2, 3, '2026-04-24 10:45:14'),
(24, '2026016', 'Tika Santoso', 'Karanganyar', '83449278709', NULL, 3, 2, 3, '2026-04-24 10:45:14'),
(25, '2026018', 'Dewi Santoso', 'Karanganyar', '82960269086', NULL, 2, 2, 3, '2026-04-24 10:45:14'),
(26, '2026019', 'Xenia Rahmawati', 'Tanjungjaya', '89699148314', NULL, 2, 5, 3, '2026-04-24 10:45:14'),
(27, '2026021', 'Citra Nugroho', 'Sukamaju', '85818111067', NULL, 3, 2, 3, '2026-04-24 10:45:14'),
(28, '2026022', 'Yoga Santoso', 'Sukamaju', '84619948690', NULL, 3, 2, 3, '2026-04-24 10:45:14'),
(29, '2026023', 'Rina Permata', 'Karanganyar', '82966616967', NULL, 3, 1, 3, '2026-04-24 10:45:14'),
(30, '2026024', 'Yoga Nugroho', 'Tanjungjaya', '87016220229', NULL, 2, 3, 3, '2026-04-24 10:45:14'),
(31, '2026025', 'Budi Pratama', 'Tanjungjaya', '89261740969', NULL, 1, 2, 3, '2026-04-24 10:45:14'),
(32, '2026027', 'Kurniawan Pratama', 'Tanjungjaya', '82335103427', NULL, 3, 3, 3, '2026-04-24 10:45:14'),
(33, '2026028', 'Ahmad Pratama', 'Karanganyar', '88060086842', NULL, 3, 3, 3, '2026-04-24 10:45:14'),
(34, '2026030', 'Citra Maulana', 'Sukamaju', '81843482825', NULL, 2, 4, 3, '2026-04-24 10:45:14'),
(35, '2026034', 'Hendra Wijaya', 'Karanganyar', '86841528761', NULL, 2, 4, 3, '2026-04-24 10:45:14'),
(36, '2026036', 'Hendra Permata', 'Karanganyar', '84483660155', NULL, 1, 2, 3, '2026-04-24 10:45:14'),
(37, '2026037', 'Hendra Nugroho', 'Karanganyar', '87582960996', NULL, 2, 3, 3, '2026-04-24 10:45:14'),
(38, '2026038', 'Dewi Saputra', 'Tanjungjaya', '87224666242', NULL, 1, 4, 3, '2026-04-24 10:45:14'),
(39, '2026041', 'Nanda Hidayat', 'Sukamaju', '81130049769', NULL, 1, 4, 3, '2026-04-24 10:45:14'),
(40, '2026047', 'Lestari Rahmawati', 'Sukamaju', '87878288852', NULL, 2, 5, 3, '2026-04-24 10:45:14'),
(41, '2026048', 'Budi Hidayat', 'Tanjungjaya', '83973241990', NULL, 1, 1, 3, '2026-04-24 10:45:14'),
(42, '2026049', 'Lestari Hidayat', 'Tanjungjaya', '86934374567', NULL, 3, 5, 3, '2026-04-24 10:45:14'),
(43, '2026052', 'Dewi Pratama', 'Sukamaju', '83997457342', NULL, 1, 2, 3, '2026-04-24 10:45:14'),
(44, '2026055', 'Dewi Gunawan', 'Tanjungjaya', '84955792709', NULL, 1, 4, 3, '2026-04-24 10:45:14'),
(45, '2026057', 'Intan Permata', 'Tanjungjaya', '88864688499', NULL, 1, 5, 3, '2026-04-24 10:45:14'),
(46, '2026058', 'Rina Maulana', 'Karanganyar', '82495629518', NULL, 1, 3, 3, '2026-04-24 10:45:14'),
(47, '2026060', 'Gina Hidayat', 'Karanganyar', '82453909325', NULL, 3, 5, 3, '2026-04-24 10:45:15'),
(48, '2026063', 'Zahra Gunawan', 'Tanjungjaya', '86633912616', NULL, 1, 1, 3, '2026-04-24 10:45:15'),
(49, '2026069', 'Lestari Permata', 'Sukamaju', '87599738125', NULL, 1, 4, 3, '2026-04-24 10:45:15'),
(50, '2026070', 'Xenia Gunawan', 'Sukamaju', '86097270927', NULL, 3, 2, 3, '2026-04-24 10:45:15'),
(51, '2026071', 'Rina Gunawan', 'Karanganyar', '84453330356', NULL, 1, 2, 3, '2026-04-24 10:45:15'),
(52, '2026072', 'Hendra Santoso', 'Karanganyar', '81401074117', NULL, 3, 3, 3, '2026-04-24 10:45:15'),
(53, '2026073', 'Tika Nugroho', 'Tanjungjaya', '83571755027', NULL, 1, 1, 3, '2026-04-24 10:45:15'),
(54, '2026076', 'Ahmad Santoso', 'Sukamaju', '89127929615', NULL, 3, 1, 3, '2026-04-24 10:45:15'),
(55, '2026077', 'Ahmad Gunawan', 'Karanganyar', '88950193406', NULL, 3, 2, 3, '2026-04-24 10:45:15'),
(56, '2026078', 'Rina Wijaya', 'Tanjungjaya', '83970206780', NULL, 1, 2, 3, '2026-04-24 10:45:15'),
(57, '2026080', 'Zahra Hidayat', 'Karanganyar', '85291099475', NULL, 1, 3, 3, '2026-04-24 10:45:15'),
(58, '2026081', 'Umar Permata', 'Karanganyar', '83646691331', NULL, 1, 1, 3, '2026-04-24 10:45:15'),
(59, '2026082', 'Muhammad Permata', 'Sukamaju', '85037141725', NULL, 1, 4, 3, '2026-04-24 10:45:15'),
(60, '2026083', 'Kurniawan Permata', 'Tanjungjaya', '86973315784', NULL, 1, 5, 3, '2026-04-24 10:45:15'),
(61, '2026084', 'Muhammad Pratama', 'Karanganyar', '84156202108', NULL, 2, 1, 3, '2026-04-24 10:45:15'),
(62, '2026085', 'Fitri Maulana', 'Sukamaju', '88205337253', NULL, 3, 2, 3, '2026-04-24 10:45:15'),
(63, '2026087', 'Qori Rahmawati', 'Tanjungjaya', '89515362032', NULL, 2, 3, 3, '2026-04-24 10:45:15'),
(64, '2026089', 'Qori Saputra', 'Tanjungjaya', '87289395126', NULL, 2, 3, 3, '2026-04-24 10:45:15'),
(65, '2026091', 'Citra Permata', 'Sukamaju', '84122509696', NULL, 2, 2, 3, '2026-04-24 10:45:15'),
(66, '2026092', 'Muhammad Santoso', 'Tanjungjaya', '87477061682', NULL, 3, 5, 3, '2026-04-24 10:45:15'),
(67, '2026093', 'Yoga Santoso', 'Karanganyar', '84073020198', NULL, 1, 4, 3, '2026-04-24 10:45:15'),
(68, '2026095', 'Nanda Pratama', 'Sukamaju', '89565755020', NULL, 2, 5, 3, '2026-04-24 10:45:15'),
(69, '2026097', 'Vina Pratama', 'Tanjungjaya', '87292227063', NULL, 1, 2, 3, '2026-04-24 10:45:15'),
(70, '2026100', 'Umar Rahmawati', 'Karanganyar', '87009568461', NULL, 1, 3, 3, '2026-04-24 10:45:15'),
(71, '2026101', 'Fitri Saputra', 'Sukamaju', '88948298149', NULL, 2, 4, 3, '2026-04-24 10:45:15'),
(72, '2026104', 'Lestari Maulana', 'Tanjungjaya', '87978097802', NULL, 3, 4, 3, '2026-04-24 10:45:15'),
(73, '2026106', 'Xenia Rahmawati', 'Tanjungjaya', '87094442536', NULL, 3, 4, 3, '2026-04-24 10:45:15'),
(74, '2026108', 'Gina Gunawan', 'Tanjungjaya', '85313496501', NULL, 3, 5, 3, '2026-04-24 10:45:15'),
(75, '2026110', 'Qori Pratama', 'Karanganyar', '89953545023', NULL, 3, 5, 3, '2026-04-24 10:45:15'),
(76, '2026111', 'Saputra Pratama', 'Sukamaju', '82906100543', NULL, 2, 5, 3, '2026-04-24 10:45:15'),
(77, '2026112', 'Qori Rahmawati', 'Tanjungjaya', '86392678675', NULL, 1, 4, 3, '2026-04-24 10:45:15'),
(78, '2026115', 'Muhammad Permata', 'Karanganyar', '84628185426', NULL, 2, 5, 3, '2026-04-24 10:45:15'),
(79, '2026117', 'Putra Saputra', 'Karanganyar', '86126393527', NULL, 3, 1, 3, '2026-04-24 10:45:15'),
(80, '2026120', 'Muhammad Pratama', 'Karanganyar', '89375943916', NULL, 1, 2, 3, '2026-04-24 10:45:15');

-- --------------------------------------------------------

--
-- Table structure for table `tahun_ajaran`
--

CREATE TABLE `tahun_ajaran` (
  `id` int NOT NULL,
  `tahun` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tahun_ajaran`
--

INSERT INTO `tahun_ajaran` (`id`, `tahun`) VALUES
(1, '2022/2023'),
(2, '2023/2024'),
(3, '2024/2025');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '2026-04-24 05:51:20'),
(2, 'staff1', '$2y$10$xORZBki05wGBW9LUFTAsceX74NOIfd38201q.5aDk5UCUuAhgXypS', 'staff', '2026-04-24 05:51:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `jurusan`
--
ALTER TABLE `jurusan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode` (`kode`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_kelas` (`nama_kelas`);

--
-- Indexes for table `siswa`
--
ALTER TABLE `siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nis` (`nis`),
  ADD KEY `kelas_id` (`kelas_id`),
  ADD KEY `jurusan_id` (`jurusan_id`),
  ADD KEY `tahun_ajaran_id` (`tahun_ajaran_id`);

--
-- Indexes for table `tahun_ajaran`
--
ALTER TABLE `tahun_ajaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tahun` (`tahun`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `jurusan`
--
ALTER TABLE `jurusan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `siswa`
--
ALTER TABLE `siswa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `tahun_ajaran`
--
ALTER TABLE `tahun_ajaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `siswa`
--
ALTER TABLE `siswa`
  ADD CONSTRAINT `siswa_ibfk_1` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `siswa_ibfk_2` FOREIGN KEY (`jurusan_id`) REFERENCES `jurusan` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `siswa_ibfk_3` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
