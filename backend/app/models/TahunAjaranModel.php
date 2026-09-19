<?php
class TahunAjaranModel extends BaseModel {
    protected string $table = 'tahun_ajaran';

    public function findAllWithCount(): array {
        $stmt = $this->db->prepare(
            "SELECT ta.*, COUNT(s.id) as jumlah_siswa
             FROM tahun_ajaran ta LEFT JOIN siswa s ON s.tahun_ajaran_id = ta.id
             GROUP BY ta.id ORDER BY ta.tahun DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function tahunExists(string $tahun, ?int $excludeId = null): bool {
        $sql    = "SELECT COUNT(*) FROM tahun_ajaran WHERE tahun = ?";
        $params = [$tahun];
        if ($excludeId) { $sql .= " AND id != ?"; $params[] = $excludeId; }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn() > 0;
    }
}
