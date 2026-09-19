<?php
class JurusanController extends BaseController {
    private JurusanModel $model;

    public function __construct() {
        $this->model = new JurusanModel();
    }

    public function getAll(): void {
        $this->requireAuth();
        $this->success($this->model->findAllWithCount());
    }

    public function getOne(string $id): void {
        $this->requireAuth();
        $j = $this->model->findById((int)$id);
        if (!$j) $this->error('Jurusan tidak ditemukan', 404);
        $this->success($j);
    }

    public function postAll(): void {
        $user = $this->requireAdmin();
        $data = $this->getBody();
        $err  = $this->validate($data, ['nama_jurusan', 'kode']);
        if ($err) $this->error($err);

        if ($this->model->kodeExists(strtoupper($data['kode']))) {
            $this->error('Kode jurusan sudah ada');
        }

        $id = $this->model->create([
            'nama_jurusan' => $data['nama_jurusan'],
            'kode'         => strtoupper($data['kode']),
        ]);
        $this->logActivity($user['id'], "Tambah jurusan: {$data['nama_jurusan']}");
        $this->success($this->model->findById($id), 'Jurusan berhasil ditambahkan', 201);
    }

    public function putOne(string $id): void {
        $user = $this->requireAdmin();
        $data = $this->getBody();
        $j    = $this->model->findById((int)$id);
        if (!$j) $this->error('Jurusan tidak ditemukan', 404);

        $err = $this->validate($data, ['nama_jurusan', 'kode']);
        if ($err) $this->error($err);

        if ($this->model->kodeExists(strtoupper($data['kode']), (int)$id)) {
            $this->error('Kode jurusan sudah digunakan');
        }

        $this->model->update((int)$id, [
            'nama_jurusan' => $data['nama_jurusan'],
            'kode'         => strtoupper($data['kode']),
        ]);
        $this->logActivity($user['id'], "Update jurusan ID $id");
        $this->success($this->model->findById((int)$id), 'Jurusan berhasil diupdate');
    }

    public function deleteOne(string $id): void {
        $user = $this->requireAdmin();
        $j    = $this->model->findById((int)$id);
        if (!$j) $this->error('Jurusan tidak ditemukan', 404);

        $db   = Database::getInstance();
        $stmt = $db->prepare("SELECT COUNT(*) FROM siswa WHERE jurusan_id = ?");
        $stmt->execute([$id]);
        if ((int)$stmt->fetchColumn() > 0) {
            $this->error('Tidak bisa hapus jurusan yang masih memiliki siswa');
        }

        $this->model->delete((int)$id);
        $this->logActivity($user['id'], "Hapus jurusan: {$j['nama_jurusan']}");
        $this->success(null, 'Jurusan berhasil dihapus');
    }
}
