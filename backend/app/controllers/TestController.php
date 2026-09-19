<?php
// app/controllers/TestController.php - Controller untuk testing endpoint

class TestController extends BaseController {
    
    // GET /test - Test endpoint availability
    public function getAll(): void {
        $this->success([
            'message' => 'Backend API is working!',
            'timestamp' => date('Y-m-d H:i:s'),
            'php_version' => PHP_VERSION,
            'endpoints' => [
                'auth' => '/auth (POST: login, logout | GET: check session)',
                'siswa' => '/siswa (GET, POST, PUT, DELETE)',
                'kelas' => '/kelas (GET, POST, PUT, DELETE)',
                'jurusan' => '/jurusan (GET, POST, PUT, DELETE)',
                'tahun-ajaran' => '/tahun-ajaran (GET, POST, PUT, DELETE)',
                'users' => '/users (GET, POST, PUT, DELETE)',
                'dashboard' => '/dashboard (GET)',
                'activity-logs' => '/activity-logs (GET)',
            ],
        ], 'Test endpoint');
    }
    
    // POST /test - Echo request body
    public function postAll(): void {
        $body = $this->getBody();
        $this->success([
            'received' => $body,
            'method' => $_SERVER['REQUEST_METHOD'],
            'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
        ], 'Echo test');
    }
}
