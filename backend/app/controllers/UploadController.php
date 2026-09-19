<?php
class UploadController extends BaseController {

    // POST /api/upload - Upload foto siswa
    public function postAll(): void {
        $user = $this->requireAuth();

        if (empty($_FILES['foto'])) {
            $this->error('Tidak ada file yang diupload');
        }

        $file     = $_FILES['foto'];
        $allowed  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        $maxSize  = 2 * 1024 * 1024; // 2MB

        if ($file['error'] !== UPLOAD_ERR_OK) {
            $this->error('Upload gagal, error code: ' . $file['error']);
        }
        if (!in_array($file['type'], $allowed)) {
            $this->error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP');
        }
        if ($file['size'] > $maxSize) {
            $this->error('Ukuran file terlalu besar. Maksimal 2MB');
        }

        // Buat folder uploads jika belum ada
        $uploadDir = UPLOADS_PATH;
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generate nama file unik
        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'siswa_' . time() . '_' . uniqid() . '.' . strtolower($ext);
        $dest     = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            $this->error('Gagal menyimpan file');
        }

        $this->logActivity($user['id'], "Upload foto: $filename");
        $this->success([
            'filename' => $filename,
            'url'      => UPLOADS_URL . $filename,
        ], 'Foto berhasil diupload');
    }
}
