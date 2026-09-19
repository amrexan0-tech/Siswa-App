<?php
class DashboardController extends BaseController {
    public function getAll(): void {
        $this->requireAuth();
        $db = Database::getInstance();

        // Total counts
        $totalSiswa   = (int)$db->query("SELECT COUNT(*) FROM siswa")->fetchColumn();
        $totalKelas   = (int)$db->query("SELECT COUNT(*) FROM kelas")->fetchColumn();
        $totalJurusan = (int)$db->query("SELECT COUNT(*) FROM jurusan")->fetchColumn();
        $totalUsers   = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();

        // Siswa per jurusan (untuk chart)
        $siswaModel = new SiswaModel();
        $perJurusan = $siswaModel->countPerJurusan();
        $perKelas   = $siswaModel->countPerKelas();

        // Siswa terbaru
        $stmt = $db->prepare(
            "SELECT s.nama, s.nis, k.nama_kelas, j.nama_jurusan, s.created_at
             FROM siswa s
             LEFT JOIN kelas k ON s.kelas_id = k.id
             LEFT JOIN jurusan j ON s.jurusan_id = j.id
             ORDER BY s.created_at DESC LIMIT 5"
        );
        $stmt->execute();
        $siswaTerbaru = $stmt->fetchAll();

        // Aktivitas terbaru
        $stmt2 = $db->prepare(
            "SELECT al.aktivitas, al.created_at, u.username
             FROM activity_logs al
             LEFT JOIN users u ON al.user_id = u.id
             ORDER BY al.created_at DESC LIMIT 8"
        );
        $stmt2->execute();
        $aktivitasTerbaru = $stmt2->fetchAll();

        $this->success([
            'stats' => [
                'total_siswa'   => $totalSiswa,
                'total_kelas'   => $totalKelas,
                'total_jurusan' => $totalJurusan,
                'total_users'   => $totalUsers,
            ],
            'chart' => [
                'per_jurusan' => $perJurusan,
                'per_kelas'   => $perKelas,
            ],
            'siswa_terbaru'     => $siswaTerbaru,
            'aktivitas_terbaru' => $aktivitasTerbaru,
        ]);
    }
}
