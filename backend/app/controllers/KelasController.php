<?php
class KelasController extends BaseController {
    private KelasModel $model;

    public function __construct() {
        $this->model = new KelasModel();
    }

    public function getAll(): void {
        $this->requireAuth();
        $data = $this->model->findAllWithCount();
        $this->success($data);
    }

    public function getOne(string $id): void {
        $this->requireAuth();
        $kelas = $this->model->findById((int)$id);
        if (!$kelas) $this->error('Kelas tidak ditemukan', 404);
        $this->success($kelas);
    }

    public function postAll(): void {
        $user = $this->requireAdmin();
        $data = $this->getBody();
        $err  = $this->validate($data, ['nama_kelas']);
        if ($err) $this->error($err);

        if ($this->model->exists(['nama_kelas' => $data['nama_kelas']])) {
            $this->error('Nama kelas sudah ada');
        }

        $id = $this->model->create(['nama_kelas' => $data['nama_kelas']]);
        $this->logActivity($user['id'], "Tambah kelas: {$data['nama_kelas']}");
        $this->success($this->model->findById($id), 'Kelas berhasil ditambahkan', 201);
    }

    public function putOne(string $id): void {
        $user  = $this->requireAdmin();
        $data  = $this->getBody();
        $kelas = $this->model->findById((int)$id);
        if (!$kelas) $this->error('Kelas tidak ditemukan', 404);

        $err = $this->validate($data, ['nama_kelas']);
        if ($err) $this->error($err);

        $this->model->update((int)$id, ['nama_kelas' => $data['nama_kelas']]);
        $this->logActivity($user['id'], "Update kelas ID $id: {$data['nama_kelas']}");
        $this->success($this->model->findById((int)$id), 'Kelas berhasil diupdate');
    }

    public function deleteOne(string $id): void {
        $user  = $this->requireAdmin();
        $kelas = $this->model->findById((int)$id);
        if (!$kelas) $this->error('Kelas tidak ditemukan', 404);

        // Cek apakah ada siswa di kelas ini
        $db   = Database::getInstance();
        $stmt = $db->prepare("SELECT COUNT(*) FROM siswa WHERE kelas_id = ?");
        $stmt->execute([$id]);
        if ((int)$stmt->fetchColumn() > 0) {
            $this->error('Tidak bisa hapus kelas yang masih memiliki siswa');
        }

        $this->model->delete((int)$id);
        $this->logActivity($user['id'], "Hapus kelas: {$kelas['nama_kelas']}");
        $this->success(null, 'Kelas berhasil dihapus');
    }
}
