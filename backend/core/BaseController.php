<?php
// core/BaseController.php - Base controller dengan helper methods

class BaseController {

    /**
     * Kirim response JSON sukses
     */
    protected function success(mixed $data = null, string $message = 'Success', int $code = 200): void {
        http_response_code($code);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ]);
        exit;
    }

    /**
     * Kirim response JSON error
     */
    protected function error(string $message = 'Error', int $code = 400, mixed $errors = null): void {
        http_response_code($code);
        header('Content-Type: application/json; charset=UTF-8');
        $response = ['success' => false, 'message' => $message];
        if ($errors !== null) $response['errors'] = $errors;
        echo json_encode($response);
        exit;
    }

    /**
     * Ambil body JSON dari request
     */
    protected function getBody(): array {
        $raw = file_get_contents('php://input');
        return json_decode($raw, true) ?? [];
    }

    /**
     * Validasi field wajib
     */
    protected function validate(array $data, array $required): ?string {
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return "Field '$field' is required";
            }
        }
        return null;
    }

    /**
     * Cek apakah user sudah login.
     *
     * Mendukung dua metode autentikasi:
     * 1. PHP Session (untuk request normal via axios withCredentials)
     * 2. Query param ?_user=<json> (untuk window.open() export, tidak bisa kirim cookie)
     *
     * CATATAN: Metode 2 hanya untuk GET request (export), dan user data
     * sudah tersimpan di localStorage frontend.
     */
    protected function requireAuth(): array {
        if (session_status() === PHP_SESSION_NONE) session_start();

        // Prioritas 1: PHP Session (request normal)
        if (!empty($_SESSION['user'])) {
            return $_SESSION['user'];
        }

        // Prioritas 2: Query param _user (untuk window.open() export)
        // Hanya boleh untuk GET request
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && !empty($_GET['_user'])) {
            $userData = json_decode(urldecode($_GET['_user']), true);
            if (is_array($userData) && !empty($userData['id'])) {
                return $userData;
            }
        }

        // Prioritas 3: Header X-Auth-Token (untuk axios request tanpa session)
        $authHeader = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
        if ($authHeader) {
            $userData = json_decode(base64_decode($authHeader), true);
            if (is_array($userData) && !empty($userData['id'])) {
                return $userData;
            }
        }

        $this->error('Unauthorized - Silakan login terlebih dahulu', 401);
    }

    /**
     * Cek apakah user adalah admin
     */
    protected function requireAdmin(): array {
        $user = $this->requireAuth();
        if ($user['role'] !== 'admin') {
            $this->error('Forbidden: Admin only', 403);
        }
        return $user;
    }

    /**
     * Log aktivitas user
     */
    protected function logActivity(int $userId, string $aktivitas): void {
        try {
            $db   = Database::getInstance();
            $stmt = $db->prepare("INSERT INTO activity_logs (user_id, aktivitas) VALUES (?, ?)");
            $stmt->execute([$userId, $aktivitas]);
        } catch (Exception $e) {
            // Silent fail - log tidak boleh mengganggu operasi utama
        }
    }

    /**
     * Pagination helper
     */
    protected function getPagination(): array {
        $page  = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(100, max(1, (int)($_GET['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;
        return compact('page', 'limit', 'offset');
    }
}
