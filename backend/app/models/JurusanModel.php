<?php
class JurusanModel extends BaseModel {
    protected string $table = 'jurusan';

    public function findAllWithCount(): array {
        $stmt = $this->db->prepare(
            "SELECT j.*, COUNT(s.id) as jumlah_siswa
             FROM jurusan j LEFT JOIN siswa s ON s.jurusan_id = j.id
             GROUP BY j.id ORDER BY j.nama_jurusan"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function kodeExists(string $kode, ?int $excludeId = null): bool {
        $sql    = "SELECT COUNT(*) FROM jurusan WHERE kode = ?";
        $params = [$kode];
        if ($excludeId) { $sql .= " AND id != ?"; $params[] = $excludeId; }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn() > 0;
    }
}
