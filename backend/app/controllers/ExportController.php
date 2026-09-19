<?php
class ExportController extends BaseController {
    private SiswaModel $model;

    public function __construct() {
        $this->model = new SiswaModel();
    }

    // GET /api/export/csv
    public function getCsv(): void {
        $this->requireAuth();

        $filters = [
            'kelas_id'        => $_GET['kelas_id'] ?? '',
            'jurusan_id'      => $_GET['jurusan_id'] ?? '',
            'tahun_ajaran_id' => $_GET['tahun_ajaran_id'] ?? '',
        ];

        $data = $this->model->findAllForExport($filters);

        // Hapus semua header JSON yang mungkin sudah di-set
        header_remove('Content-Type');

        // Set header untuk download CSV
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="data_siswa_' . date('Ymd_His') . '.csv"');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');

        $output = fopen('php://output', 'w');

        // BOM untuk UTF-8 agar Excel bisa baca dengan benar
        fputs($output, "\xEF\xBB\xBF");

        // Header kolom CSV
        fputcsv($output, ['No', 'NIS', 'Nama', 'Alamat', 'No HP', 'Kelas', 'Jurusan', 'Tahun Ajaran']);

        $no = 1;
        foreach ($data as $row) {
            fputcsv($output, [
                $no++,
                $row['nis'],
                $row['nama'],
                $row['alamat'] ?? '',
                $row['no_hp'] ?? '',
                $row['nama_kelas'] ?? '',
                $row['nama_jurusan'] ?? '',
                $row['tahun'] ?? '',
            ]);
        }

        fclose($output);
        exit;
    }

    // GET /api/export/pdf - Export PDF (HTML print)
    public function getPdf(): void {
        $this->requireAuth();

        $filters = [
            'kelas_id'        => $_GET['kelas_id'] ?? '',
            'jurusan_id'      => $_GET['jurusan_id'] ?? '',
            'tahun_ajaran_id' => $_GET['tahun_ajaran_id'] ?? '',
        ];

        $data = $this->model->findAllForExport($filters);

        header_remove('Content-Type');
        header('Content-Type: text/html; charset=UTF-8');

        $html = $this->generatePdfHtml($data);
        echo $html;
        exit;
    }

    private function generatePdfHtml(array $data): string {
        $rows = '';
        $no   = 1;
        foreach ($data as $row) {
            $rows .= "<tr>
                <td>{$no}</td>
                <td>" . htmlspecialchars($row['nis']) . "</td>
                <td>" . htmlspecialchars($row['nama']) . "</td>
                <td>" . htmlspecialchars($row['alamat'] ?? '-') . "</td>
                <td>" . htmlspecialchars($row['no_hp'] ?? '-') . "</td>
                <td>" . htmlspecialchars($row['nama_kelas'] ?? '-') . "</td>
                <td>" . htmlspecialchars($row['nama_jurusan'] ?? '-') . "</td>
                <td>" . htmlspecialchars($row['tahun'] ?? '-') . "</td>
            </tr>";
            $no++;
        }

        $total = count($data);
        $date  = date('d/m/Y H:i');

        return <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Data Siswa - EduCore</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
  h2 { text-align: center; margin-bottom: 4px; }
  .subtitle { text-align: center; color: #666; margin-bottom: 16px; font-size: 11px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #1e40af; color: white; padding: 8px 6px; text-align: left; }
  td { padding: 6px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #f8fafc; }
  .footer { margin-top: 16px; font-size: 11px; color: #666; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
<h2>DATA SISWA - EDUCORE</h2>
<p class="subtitle">Dicetak pada: {$date} &nbsp;|&nbsp; Total: {$total} siswa</p>
<table>
  <thead>
    <tr>
      <th>No</th><th>NIS</th><th>Nama</th><th>Alamat</th>
      <th>No HP</th><th>Kelas</th><th>Jurusan</th><th>Tahun Ajaran</th>
    </tr>
  </thead>
  <tbody>{$rows}</tbody>
</table>
<div class="footer">* Dokumen ini digenerate otomatis oleh EduCore - Sistem Informasi Akademik</div>
<script>window.onload = function() { window.print(); }</script>
</body>
</html>
HTML;
    }
}
