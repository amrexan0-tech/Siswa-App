<?php
/**
 * Script untuk generate password hash
 * Jalankan: php generate_password.php
 */

$password = 'password';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password: $password\n";
echo "Hash: $hash\n\n";

echo "SQL Update:\n";
echo "UPDATE users SET password = '$hash' WHERE username IN ('admin', 'staff1');\n\n";

// Verifikasi
if (password_verify($password, $hash)) {
    echo "✓ Verifikasi berhasil!\n";
} else {
    echo "✗ Verifikasi gagal!\n";
}
