<?php
// app/models/SiswaModel.php

class SiswaModel extends BaseModel {
    protected string $table = 'siswa';

    /**
     * Ambil semua siswa dengan JOIN ke kelas, jurusan, tahun_ajaran
     */
    public function findAllWithRelations(array $filters = [], int $limit = 10, int $offset = 0): array {
        $sql = "SELECT s.*, k.nama_kelas, j.nama_jurusan, j.kode as kode_jurusan, ta.tahun
                FROM siswa s
                LEFT JOIN kelas k ON s.kelas_id = k.id
                LEFT JOIN jurusan j ON s.jurusan_id = j.id
                LEFT JOIN tahun_ajaran ta ON s.tahun_ajaran_id = ta.id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['search'])) {
            $sql .= " AND (s.nama LIKE ? OR s.nis LIKE ? OR s.alamat LIKE ?)";
            $search = '%' . $filters['search'] . '%';
            $params = array_merge($params, [$search, $search, $search]);
        }
        if (!empty($filters['kelas_id'])) {
            $sql .= " AND s.kelas_id = ?";
            $params[] = $filters['kelas_id'];
        }
        if (!empty($filters['jurusan_id'])) {
            $sql .= " AND s.jurusan_id = ?";
            $params[] = $filters['jurusan_id'];
        }
        if (!empty($filters['tahun_ajaran_id'])) {
            $sql .= " AND s.tahun_ajaran_id = ?";
            $params[] = $filters['tahun_ajaran_id'];
        }

        $sql .= " ORDER BY s.id DESC LIMIT $limit OFFSET $offset";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Hitung total siswa dengan filter
     */
    public function countWithFilters(array $filters = []): int {
        $sql    = "SELECT COUNT(*) FROM siswa s WHERE 1=1";
        $params = [];

        if (!empty($filters['search'])) {
            $sql .= " AND (s.nama LIKE ? OR s.nis LIKE ? OR s.alamat LIKE ?)";
            $search = '%' . $filters['search'] . '%';
            $params = array_merge($params, [$search, $search, $search]);
        }
        if (!empty($filters['kelas_id']))        { $sql .= " AND s.kelas_id = ?";        $params[] = $filters['kelas_id']; }
        if (!empty($filters['jurusan_id']))       { $sql .= " AND s.jurusan_id = ?";       $params[] = $filters['jurusan_id']; }
        if (!empty($filters['tahun_ajaran_id']))  { $sql .= " AND s.tahun_ajaran_id = ?";  $params[] = $filters['tahun_ajaran_id']; }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }

    /**
     * Ambil satu siswa dengan relasi
     */
    public function findByIdWithRelations(int $id): ?array {
        $stmt = $this->db->prepare(
            "SELECT s.*, k.nama_kelas, j.nama_jurusan, j.kode as kode_jurusan, ta.tahun
             FROM siswa s
             LEFT JOIN kelas k ON s.kelas_id = k.id
             LEFT JOIN jurusan j ON s.jurusan_id = j.id
             LEFT JOIN tahun_ajaran ta ON s.tahun_ajaran_id = ta.id
             WHERE s.id = ? LIMIT 1"
        );
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Statistik siswa per jurusan
     */
    public function countPerJurusan(): array {
        $stmt = $this->db->prepare(
            "SELECT j.nama_jurusan, j.kode, COUNT(s.id) as total
             FROM jurusan j
             LEFT JOIN siswa s ON s.jurusan_id = j.id
             GROUP BY j.id ORDER BY total DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Statistik siswa per kelas
     */
    public function countPerKelas(): array {
        $stmt = $this->db->prepare(
            "SELECT k.nama_kelas, COUNT(s.id) as total
             FROM kelas k
             LEFT JOIN siswa s ON s.kelas_id = k.id
             GROUP BY k.id ORDER BY k.nama_kelas"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Cek NIS sudah ada atau belum
     */
    public function nisExists(string $nis, ?int $excludeId = null): bool {
        $sql    = "SELECT COUNT(*) FROM siswa WHERE nis = ?";
        $params = [$nis];
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn() > 0;
    }

    /**
     * Ambil semua siswa untuk export (tanpa pagination)
     */
    public function findAllForExport(array $filters = []): array {
        $sql = "SELECT s.nis, s.nama, s.alamat, s.no_hp, k.nama_kelas, j.nama_jurusan, ta.tahun
                FROM siswa s
                LEFT JOIN kelas k ON s.kelas_id = k.id
                LEFT JOIN jurusan j ON s.jurusan_id = j.id
                LEFT JOIN tahun_ajaran ta ON s.tahun_ajaran_id = ta.id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['kelas_id']))       { $sql .= " AND s.kelas_id = ?";       $params[] = $filters['kelas_id']; }
        if (!empty($filters['jurusan_id']))      { $sql .= " AND s.jurusan_id = ?";      $params[] = $filters['jurusan_id']; }
        if (!empty($filters['tahun_ajaran_id'])) { $sql .= " AND s.tahun_ajaran_id = ?"; $params[] = $filters['tahun_ajaran_id']; }

        $sql .= " ORDER BY s.nama ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
