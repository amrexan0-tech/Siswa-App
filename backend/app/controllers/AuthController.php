<?php
// app/controllers/AuthController.php

class AuthController extends BaseController {
    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    // POST /api/auth - Login
    public function postAll(): void {
        $body = $this->getBody();
        $action = $body['action'] ?? 'login';

        if ($action === 'login') {
            $this->login($body);
        } elseif ($action === 'logout') {
            $this->logout();
        } else {
            $this->error('Unknown action');
        }
    }

    // GET /api/auth - Cek status login
    public function getAll(): void {
        if (session_status() === PHP_SESSION_NONE) session_start();
        if (!empty($_SESSION['user'])) {
            $this->success($_SESSION['user'], 'Authenticated');
        } else {
            $this->error('Not authenticated', 401);
        }
    }

    private function login(array $body): void {
        $err = $this->validate($body, ['username', 'password']);
        if ($err) $this->error($err);

        $user = $this->userModel->findByUsername($body['username']);
        if (!$user || !password_verify($body['password'], $user['password'])) {
            $this->error('Username atau password salah', 401);
        }

        // Mulai session dan simpan user (tanpa password)
        if (session_status() === PHP_SESSION_NONE) session_start();
        unset($user['password']);
        $_SESSION['user'] = $user;

        $this->logActivity($user['id'], "Login berhasil");
        $this->success($user, 'Login berhasil');
    }

    private function logout(): void {
        if (session_status() === PHP_SESSION_NONE) session_start();
        if (!empty($_SESSION['user'])) {
            $this->logActivity($_SESSION['user']['id'], "Logout");
        }
        session_destroy();
        $this->success(null, 'Logout berhasil');
    }
}
