<?php
class TahunAjaranController extends BaseController {
    private TahunAjaranModel $model;

    public function __construct() {
        $this->model = new TahunAjaranModel();
    }

    public function getAll(): void {
        $this->requireAuth();
        $this->success($this->model->findAllWithCount());
    }

    public function getOne(string $id): void {
        $this->requireAuth();
        $ta = $this->model->findById((int)$id);
        if (!$ta) $this->error('Tahun ajaran tidak ditemukan', 404);
        $this->success($ta);
    }

    public function postAll(): void {
        $user = $this->requireAdmin();
        $data = $this->getBody();
        $err  = $this->validate($data, ['tahun']);
        if ($err) $this->error($err);

        if ($this->model->tahunExists($data['tahun'])) {
            $this->error('Tahun ajaran sudah ada');
        }

        $id = $this->model->create(['tahun' => $data['tahun']]);
        $this->logActivity($user['id'], "Tambah tahun ajaran: {$data['tahun']}");
        $this->success($this->model->findById($id), 'Tahun ajaran berhasil ditambahkan', 201);
    }

    public function putOne(string $id): void {
        $user = $this->requireAdmin();
        $data = $this->getBody();
        $ta   = $this->model->findById((int)$id);
        if (!$ta) $this->error('Tahun ajaran tidak ditemukan', 404);

        $err = $this->validate($data, ['tahun']);
        if ($err) $this->error($err);

        if ($this->model->tahunExists($data['tahun'], (int)$id)) {
            $this->error('Tahun ajaran sudah ada');
        }

        $this->model->update((int)$id, ['tahun' => $data['tahun']]);
        $this->logActivity($user['id'], "Update tahun ajaran ID $id: {$data['tahun']}");
        $this->success($this->model->findById((int)$id), 'Tahun ajaran berhasil diupdate');
    }

    public function deleteOne(string $id): void {
        $user = $this->requireAdmin();
        $ta   = $this->model->findById((int)$id);
        if (!$ta) $this->error('Tahun ajaran tidak ditemukan', 404);

        $db   = Database::getInstance();
        $stmt = $db->prepare("SELECT COUNT(*) FROM siswa WHERE tahun_ajaran_id = ?");
        $stmt->execute([$id]);
        if ((int)$stmt->fetchColumn() > 0) {
            $this->error('Tidak bisa hapus tahun ajaran yang masih memiliki siswa');
        }

        $this->model->delete((int)$id);
        $this->logActivity($user['id'], "Hapus tahun ajaran: {$ta['tahun']}");
        $this->success(null, 'Tahun ajaran berhasil dihapus');
    }
}
