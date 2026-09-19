<?php
class ImportController extends BaseController {
    private SiswaModel       $siswaModel;
    private KelasModel       $kelasModel;
    private JurusanModel     $jurusanModel;
    private TahunAjaranModel $tahunModel;

    public function __construct() {
        $this->siswaModel   = new SiswaModel();
        $this->kelasModel   = new KelasModel();
        $this->jurusanModel = new JurusanModel();
        $this->tahunModel   = new TahunAjaranModel();
    }

    // GET /api/import/csv - Download template CSV kosong
    public function getCsv(): void {
        $this->requireAuth();

        header_remove('Content-Type');
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="template_import_siswa.csv"');
        header('Pragma: no-cache');

        $output = fopen('php://output', 'w');
        fputs($output, "\xEF\xBB\xBF");

        // Header
        fputcsv($output, ['NIS', 'Nama', 'Alamat', 'No HP', 'Nama Kelas', 'Kode Jurusan', 'Tahun Ajaran']);

        // Contoh baris
        fputcsv($output, ['2024001', 'Budi Santoso', 'Jl. Merdeka No. 1', '081234567890', 'X', 'RPL', '2024/2025']);
        fputcsv($output, ['2024002', 'Siti Rahayu', 'Jl. Sudirman No. 5', '089876543210', 'XI', 'TKJ', '2024/2025']);

        fclose($output);
        exit;
    }

    // POST /api/import/csv
    public function postCsv(): void {
        $user = $this->requireAuth();

        if (empty($_FILES['file'])) {
            $this->error('Tidak ada file CSV yang diupload');
        }

        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $uploadErrors = [
                UPLOAD_ERR_INI_SIZE   => 'File terlalu besar (melebihi php.ini upload_max_filesize)',
                UPLOAD_ERR_FORM_SIZE  => 'File terlalu besar (melebihi MAX_FILE_SIZE form)',
                UPLOAD_ERR_PARTIAL    => 'File hanya terupload sebagian',
                UPLOAD_ERR_NO_FILE    => 'Tidak ada file yang diupload',
                UPLOAD_ERR_NO_TMP_DIR => 'Direktori temp tidak ditemukan',
                UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk',
            ];
            $this->error($uploadErrors[$file['error']] ?? 'Upload gagal, error code: ' . $file['error']);
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext !== 'csv') {
            $this->error('File harus berformat .csv');
        }

        $handle = fopen($file['tmp_name'], 'r');
        if (!$handle) {
            $this->error('Gagal membuka file CSV');
        }

        // Baca BOM jika ada
        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            fseek($handle, 0); // Tidak ada BOM, kembali ke awal
        }

        // Deteksi delimiter otomatis (koma vs titik koma)
        // Excel Indonesia sering menyimpan CSV dengan titik koma (;)
        $firstLine = fgets($handle);
        $delimiter = ',';
        if ($firstLine !== false) {
            $commaCount     = substr_count($firstLine, ',');
            $semicolonCount = substr_count($firstLine, ';');
            if ($semicolonCount > $commaCount) {
                $delimiter = ';';
            }
            // Kembali ke awal baris pertama
            fseek($handle, $bom === "\xEF\xBB\xBF" ? 3 : 0);
        }

        $header  = fgetcsv($handle, 0, $delimiter); // Skip header row
        $success = 0;
        $failed  = 0;
        $errors  = [];
        $row     = 2;

        // Cache lookup tables
        $kelasList   = $this->kelasModel->findAll([], 0, 0, 'nama_kelas ASC');
        $jurusanList = $this->jurusanModel->findAll([], 0, 0, 'nama_jurusan ASC');
        $tahunList   = $this->tahunModel->findAll([], 0, 0, 'tahun ASC');

        $kelasMap   = array_column($kelasList,   'id', 'nama_kelas');
        $jurusanMap = array_column($jurusanList, 'id', 'kode');
        $tahunMap   = array_column($tahunList,   'id', 'tahun');

        // Buat juga map dengan huruf kecil untuk toleran case-insensitive
        $kelasMapLower   = array_change_key_case($kelasMap,   CASE_LOWER);
        $jurusanMapUpper = array_change_key_case($jurusanMap, CASE_UPPER);

        while (($data = fgetcsv($handle, 0, $delimiter)) !== false) {
            // Skip baris kosong
            if (empty(array_filter($data))) {
                $row++;
                continue;
            }

            if (count($data) < 7) {
                $actual = count($data);
                $errors[] = "Baris $row: Format tidak valid ($actual kolom terbaca, harus 7: NIS, Nama, Alamat, No HP, Kelas, Jurusan, Tahun)";
                $failed++;
                $row++;
                continue;
            }

            [$nis, $nama, $alamat, $no_hp, $kelas, $jurusan_kode, $tahun] = $data;

            $nis          = trim($nis);
            $nama         = trim($nama);
            $alamat       = trim($alamat);
            $no_hp        = trim($no_hp);
            $kelas        = trim($kelas);
            $jurusan_kode = trim($jurusan_kode);
            $tahun        = trim($tahun);

            if (empty($nis) || empty($nama)) {
                $errors[] = "Baris $row: NIS dan Nama wajib diisi";
                $failed++;
                $row++;
                continue;
            }

            if ($this->siswaModel->nisExists($nis)) {
                $errors[] = "Baris $row: NIS '$nis' sudah terdaftar";
                $failed++;
                $row++;
                continue;
            }

            // Cari kelas (case insensitive)
            $kelasId = $kelasMap[$kelas]
                ?? $kelasMapLower[strtolower($kelas)]
                ?? null;

            // Cari jurusan (case insensitive, by kode)
            $jurusanId = $jurusanMap[$jurusan_kode]
                ?? $jurusanMapUpper[strtoupper($jurusan_kode)]
                ?? null;

            // Cari tahun
            $tahunId = $tahunMap[$tahun] ?? null;

            if (!$kelasId) {
                $errors[] = "Baris $row: Kelas '$kelas' tidak ditemukan. Tersedia: " . implode(', ', array_keys($kelasMap));
                $failed++;
                $row++;
                continue;
            }
            if (!$jurusanId) {
                $errors[] = "Baris $row: Jurusan kode '$jurusan_kode' tidak ditemukan. Tersedia: " . implode(', ', array_keys($jurusanMap));
                $failed++;
                $row++;
                continue;
            }
            if (!$tahunId) {
                $errors[] = "Baris $row: Tahun Ajaran '$tahun' tidak ditemukan. Tersedia: " . implode(', ', array_keys($tahunMap));
                $failed++;
                $row++;
                continue;
            }

            try {
                $this->siswaModel->create([
                    'nis'             => $nis,
                    'nama'            => $nama,
                    'alamat'          => $alamat,
                    'no_hp'           => $no_hp,
                    'foto'            => null,
                    'kelas_id'        => $kelasId,
                    'jurusan_id'      => $jurusanId,
                    'tahun_ajaran_id' => $tahunId,
                ]);
                $success++;
            } catch (Exception $e) {
                $errors[] = "Baris $row: Gagal simpan - " . $e->getMessage();
                $failed++;
            }

            $row++;
        }

        fclose($handle);
        $this->logActivity($user['id'], "Import CSV: $success berhasil, $failed gagal");

        $this->success([
            'imported' => $success,
            'failed'   => $failed,
            'errors'   => $errors,
        ], $failed === 0
            ? "Import selesai: $success data berhasil diimpor"
            : "Import selesai: $success berhasil, $failed gagal"
        );
    }
}
