<?php
// app/models/UserModel.php

class UserModel extends BaseModel {
    protected string $table = 'users';

    public function findByUsername(string $username): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
        $stmt->execute([$username]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function findAllSafe(): array {
        $stmt = $this->db->prepare("SELECT id, username, role, created_at FROM users ORDER BY id DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function updatePassword(int $id, string $hashedPassword): bool {
        return $this->update($id, ['password' => $hashedPassword]);
    }
}
