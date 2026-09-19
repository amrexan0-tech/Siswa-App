<?php
/**
 * Script untuk test koneksi database dan endpoint
 * Akses via browser: http://localhost/siswa-app/backend/public/../test_connection.php
 * Atau jalankan: php test_connection.php
 */

// Load .env
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            [$key, $value] = explode('=', $line, 2);
            define(trim($key), trim($value));
        }
    }
}

// Default values
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', 'siswa_db');
if (!defined('DB_USER')) define('DB_USER', 'root');
if (!defined('DB_PASS')) define('DB_PASS', '');

header('Content-Type: application/json');

$result = [
    'timestamp' => date('Y-m-d H:i:s'),
    'tests' => []
];

// Test 1: PHP Version
$result['tests']['php_version'] = [
    'status' => version_compare(PHP_VERSION, '7.4.0', '>=') ? 'OK' : 'FAIL',
    'value' => PHP_VERSION,
    'required' => '7.4.0+',
];

// Test 2: Database Connection
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    $result['tests']['database_connection'] = [
        'status' => 'OK',
        'host' => DB_HOST,
        'database' => DB_NAME,
    ];
    
    // Test 3: Check users table
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $count = $stmt->fetch()['count'];
    
    $result['tests']['users_table'] = [
        'status' => $count > 0 ? 'OK' : 'WARNING',
        'count' => $count,
        'message' => $count > 0 ? 'Users found' : 'No users in database',
    ];
    
    // Test 4: Check admin user
    $stmt = $pdo->prepare("SELECT id, username, role FROM users WHERE username = ?");
    $stmt->execute(['admin']);
    $admin = $stmt->fetch();
    
    $result['tests']['admin_user'] = [
        'status' => $admin ? 'OK' : 'FAIL',
        'data' => $admin ?: null,
        'message' => $admin ? 'Admin user exists' : 'Admin user not found',
    ];
    
    // Test 5: Password verification
    if ($admin) {
        $stmt = $pdo->prepare("SELECT password FROM users WHERE username = ?");
        $stmt->execute(['admin']);
        $user = $stmt->fetch();
        
        $passwordTest = password_verify('password', $user['password']);
        
        $result['tests']['password_hash'] = [
            'status' => $passwordTest ? 'OK' : 'FAIL',
            'message' => $passwordTest 
                ? 'Password "password" verified successfully' 
                : 'Password verification failed - run generate_password.php',
        ];
    }
    
} catch (PDOException $e) {
    $result['tests']['database_connection'] = [
        'status' => 'FAIL',
        'error' => $e->getMessage(),
    ];
}

// Test 6: Check required extensions
$extensions = ['pdo', 'pdo_mysql', 'json', 'mbstring'];
foreach ($extensions as $ext) {
    $result['tests']["extension_$ext"] = [
        'status' => extension_loaded($ext) ? 'OK' : 'FAIL',
        'loaded' => extension_loaded($ext),
    ];
}

// Test 7: Check .htaccess
$htaccess = __DIR__ . '/public/.htaccess';
$result['tests']['htaccess'] = [
    'status' => file_exists($htaccess) ? 'OK' : 'FAIL',
    'path' => $htaccess,
    'exists' => file_exists($htaccess),
];

// Test 8: Check mod_rewrite (if running via web)
if (isset($_SERVER['HTTP_HOST'])) {
    $result['tests']['mod_rewrite'] = [
        'status' => function_exists('apache_get_modules') && in_array('mod_rewrite', apache_get_modules()) ? 'OK' : 'UNKNOWN',
        'message' => 'Check Apache configuration',
    ];
}

// Summary
$failed = 0;
$passed = 0;
foreach ($result['tests'] as $test) {
    if ($test['status'] === 'OK') $passed++;
    if ($test['status'] === 'FAIL') $failed++;
}

$result['summary'] = [
    'total' => count($result['tests']),
    'passed' => $passed,
    'failed' => $failed,
    'status' => $failed === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED',
];

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
