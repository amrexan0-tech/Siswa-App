<?php
class KelasModel extends BaseModel {
    protected string $table = 'kelas';

    public function findAllWithCount(): array {
        $stmt = $this->db->prepare(
            "SELECT k.*, COUNT(s.id) as jumlah_siswa
             FROM kelas k LEFT JOIN siswa s ON s.kelas_id = k.id
             GROUP BY k.id ORDER BY k.nama_kelas"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
