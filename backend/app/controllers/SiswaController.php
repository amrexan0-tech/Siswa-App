<?php
// app/controllers/SiswaController.php

class SiswaController extends BaseController {
    private SiswaModel $model;

    public function __construct() {
        $this->model = new SiswaModel();
    }

    // GET /api/siswa
    public function getAll(): void {
        $this->requireAuth();
        $pagination = $this->getPagination();
        $filters = [
            'search'         => $_GET['search'] ?? '',
            'kelas_id'       => $_GET['kelas_id'] ?? '',
            'jurusan_id'     => $_GET['jurusan_id'] ?? '',
            'tahun_ajaran_id'=> $_GET['tahun_ajaran_id'] ?? '',
        ];

        $data  = $this->model->findAllWithRelations($filters, $pagination['limit'], $pagination['offset']);
        $total = $this->model->countWithFilters($filters);

        $this->success([
            'items'       => $data,
            'total'       => $total,
            'page'        => $pagination['page'],
            'limit'       => $pagination['limit'],
            'total_pages' => ceil($total / $pagination['limit']),
        ]);
    }

    // GET /api/siswa/{id}
    public function getOne(string $id): void {
        $this->requireAuth();
        $siswa = $this->model->findByIdWithRelations((int)$id);
        if (!$siswa) $this->error('Siswa tidak ditemukan', 404);
        $this->success($siswa);
    }

    // POST /api/siswa
    public function postAll(): void {
        $user = $this->requireAuth();
        $data = $this->getBody();

        $err = $this->validate($data, ['nis', 'nama', 'kelas_id', 'jurusan_id', 'tahun_ajaran_id']);
        if ($err) $this->error($err);

        if ($this->model->nisExists($data['nis'])) {
            $this->error('NIS sudah terdaftar');
        }

        $id = $this->model->create([
            'nis'             => $data['nis'],
            'nama'            => $data['nama'],
            'alamat'          => $data['alamat'] ?? '',
            'no_hp'           => $data['no_hp'] ?? '',
            'foto'            => $data['foto'] ?? null,
            'kelas_id'        => (int)$data['kelas_id'],
            'jurusan_id'      => (int)$data['jurusan_id'],
            'tahun_ajaran_id' => (int)$data['tahun_ajaran_id'],
        ]);

        $this->logActivity($user['id'], "Tambah siswa: {$data['nama']} (NIS: {$data['nis']})");
        $siswa = $this->model->findByIdWithRelations($id);
        $this->success($siswa, 'Siswa berhasil ditambahkan', 201);
    }

    // PUT /api/siswa/{id}
    public function putOne(string $id): void {
        $user  = $this->requireAuth();
        $data  = $this->getBody();
        $siswa = $this->model->findById((int)$id);
        if (!$siswa) $this->error('Siswa tidak ditemukan', 404);

        $err = $this->validate($data, ['nis', 'nama', 'kelas_id', 'jurusan_id', 'tahun_ajaran_id']);
        if ($err) $this->error($err);

        if ($this->model->nisExists($data['nis'], (int)$id)) {
            $this->error('NIS sudah digunakan siswa lain');
        }

        $updateData = [
            'nis'             => $data['nis'],
            'nama'            => $data['nama'],
            'alamat'          => $data['alamat'] ?? '',
            'no_hp'           => $data['no_hp'] ?? '',
            'kelas_id'        => (int)$data['kelas_id'],
            'jurusan_id'      => (int)$data['jurusan_id'],
            'tahun_ajaran_id' => (int)$data['tahun_ajaran_id'],
        ];
        if (!empty($data['foto'])) $updateData['foto'] = $data['foto'];

        $this->model->update((int)$id, $updateData);
        $this->logActivity($user['id'], "Update siswa: {$data['nama']} (ID: $id)");
        $updated = $this->model->findByIdWithRelations((int)$id);
        $this->success($updated, 'Siswa berhasil diupdate');
    }

    // DELETE /api/siswa/{id}
    public function deleteOne(string $id): void {
        $user  = $this->requireAuth();
        $siswa = $this->model->findById((int)$id);
        if (!$siswa) $this->error('Siswa tidak ditemukan', 404);

        // Hapus foto jika ada
        if (!empty($siswa['foto'])) {
            $fotoPath = UPLOADS_PATH . $siswa['foto'];
            if (file_exists($fotoPath)) unlink($fotoPath);
        }

        $this->model->delete((int)$id);
        $this->logActivity($user['id'], "Hapus siswa: {$siswa['nama']} (ID: $id)");
        $this->success(null, 'Siswa berhasil dihapus');
    }
}
