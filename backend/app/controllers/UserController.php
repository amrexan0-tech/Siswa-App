<?php
class UserController extends BaseController {
    private UserModel $model;

    public function __construct() {
        $this->model = new UserModel();
    }

    // GET /api/users - List semua user (admin only)
    public function getAll(): void {
        $this->requireAdmin();
        $this->success($this->model->findAllSafe());
    }

    // POST /api/users - Tambah user baru (admin only)
    public function postAll(): void {
        $admin = $this->requireAdmin();
        $data  = $this->getBody();
        $err   = $this->validate($data, ['username', 'password', 'role']);
        if ($err) $this->error($err);

        if (!in_array($data['role'], ['admin', 'staff'])) {
            $this->error('Role harus admin atau staff');
        }
        if ($this->model->exists(['username' => $data['username']])) {
            $this->error('Username sudah digunakan');
        }

        $id = $this->model->create([
            'username' => $data['username'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'role'     => $data['role'],
        ]);
        $this->logActivity($admin['id'], "Tambah user: {$data['username']} ({$data['role']})");
        $this->success($this->model->findAllSafe()[0] ?? null, 'User berhasil ditambahkan', 201);
    }

    // PUT /api/users/{id} - Update user
    public function putOne(string $id): void {
        $admin = $this->requireAdmin();
        $data  = $this->getBody();
        $user  = $this->model->findById((int)$id);
        if (!$user) $this->error('User tidak ditemukan', 404);

        $updateData = [];
        if (!empty($data['username'])) {
            if ($this->model->exists(['username' => $data['username']]) && $user['username'] !== $data['username']) {
                $this->error('Username sudah digunakan');
            }
            $updateData['username'] = $data['username'];
        }
        if (!empty($data['role'])) {
            if (!in_array($data['role'], ['admin', 'staff'])) $this->error('Role tidak valid');
            $updateData['role'] = $data['role'];
        }
        if (!empty($data['password'])) {
            $updateData['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (empty($updateData)) $this->error('Tidak ada data yang diupdate');

        $this->model->update((int)$id, $updateData);
        $this->logActivity($admin['id'], "Update user ID $id");
        $this->success(null, 'User berhasil diupdate');
    }

    // DELETE /api/users/{id}
    public function deleteOne(string $id): void {
        $admin = $this->requireAdmin();
        $user  = $this->model->findById((int)$id);
        if (!$user) $this->error('User tidak ditemukan', 404);
        if ((int)$id === $admin['id']) $this->error('Tidak bisa menghapus akun sendiri');

        $this->model->delete((int)$id);
        $this->logActivity($admin['id'], "Hapus user: {$user['username']}");
        $this->success(null, 'User berhasil dihapus');
    }

    // PUT /api/users/{id}/profile - Update profil sendiri
    public function putProfile(string $id): void {
        $user    = $this->requireAuth();
        $data    = $this->getBody();
        $current = $this->model->findById((int)$id);
        if (!$current) $this->error('User tidak ditemukan', 404);

        // Hanya bisa update profil sendiri, kecuali admin
        if ($user['id'] != $id && $user['role'] !== 'admin') {
            $this->error('Forbidden', 403);
        }

        $updateData = [];
        if (!empty($data['username'])) $updateData['username'] = $data['username'];
        if (!empty($data['password'])) {
            if (empty($data['old_password']) || !password_verify($data['old_password'], $current['password'])) {
                $this->error('Password lama tidak sesuai');
            }
            $updateData['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (!empty($updateData)) {
            $this->model->update((int)$id, $updateData);
            $this->logActivity($user['id'], "Update profil");
        }

        $updated = $this->model->findById((int)$id);
        unset($updated['password']);

        // Update session jika update diri sendiri
        if ($user['id'] == $id) {
            $_SESSION['user'] = $updated;
        }

        $this->success($updated, 'Profil berhasil diupdate');
    }
}
