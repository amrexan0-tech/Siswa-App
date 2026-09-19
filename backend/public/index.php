<?php
// public/index.php - Entry point aplikasi backend

// Load environment variables dari .env
$envFile = dirname(__DIR__) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            [$key, $value] = explode('=', $line, 2);
            $key   = trim($key);
            $value = trim($value);
            if (!defined($key)) define($key, $value);
            $_ENV[$key] = $value;
        }
    }
}

// Definisikan konstanta path
define('BASE_PATH',       dirname(__DIR__));
define('APP_PATH',        BASE_PATH . '/app');
define('CONTROLLERS_PATH', BASE_PATH . '/app/controllers/');
define('MODELS_PATH',     BASE_PATH . '/app/models/');
define('CORE_PATH',       BASE_PATH . '/core/');
define('CONFIG_PATH',     BASE_PATH . '/config/');
define('UPLOADS_PATH',    BASE_PATH . '/public/uploads/');
define('UPLOADS_URL',     (defined('APP_URL') ? APP_URL : '') . '/uploads/');

// Default constants jika .env tidak ada
if (!defined('DB_HOST'))     define('DB_HOST', 'localhost');
if (!defined('DB_NAME'))     define('DB_NAME', 'siswa_db');
if (!defined('DB_USER'))     define('DB_USER', 'root');
if (!defined('DB_PASS'))     define('DB_PASS', '');
if (!defined('FRONTEND_URL')) define('FRONTEND_URL', 'http://localhost:5173');

// Session config
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '0');
session_start();

// Autoload core & config
require_once CORE_PATH . 'BaseModel.php';
require_once CORE_PATH . 'BaseController.php';
require_once CONFIG_PATH . 'database.php';

// Load semua models
foreach (glob(BASE_PATH . '/app/models/*.php') as $model) {
    require_once $model;
}

// Jalankan router
require_once CORE_PATH . 'App.php';
new App();
