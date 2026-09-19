<?php
// core/BaseModel.php - Base model dengan CRUD generik

class BaseModel {
    protected PDO    $db;
    protected string $table  = '';
    protected string $primaryKey = 'id';

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Ambil semua data dengan optional filter & pagination
     */
    public function findAll(array $conditions = [], int $limit = 0, int $offset = 0, string $orderBy = 'id DESC'): array {
        $sql    = "SELECT * FROM {$this->table}";
        $params = [];

        if (!empty($conditions)) {
            $clauses = [];
            foreach ($conditions as $col => $val) {
                $clauses[] = "$col = ?";
                $params[]  = $val;
            }
            $sql .= " WHERE " . implode(' AND ', $clauses);
        }

        $sql .= " ORDER BY $orderBy";

        if ($limit > 0) {
            $sql .= " LIMIT $limit OFFSET $offset";
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Ambil satu data berdasarkan ID
     */
    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Hitung total data
     */
    public function count(array $conditions = []): int {
        $sql    = "SELECT COUNT(*) FROM {$this->table}";
        $params = [];

        if (!empty($conditions)) {
            $clauses = [];
            foreach ($conditions as $col => $val) {
                $clauses[] = "$col = ?";
                $params[]  = $val;
            }
            $sql .= " WHERE " . implode(' AND ', $clauses);
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }

    /**
     * Insert data baru
     */
    public function create(array $data): int {
        $cols   = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $stmt   = $this->db->prepare("INSERT INTO {$this->table} ($cols) VALUES ($placeholders)");
        $stmt->execute(array_values($data));
        return (int)$this->db->lastInsertId();
    }

    /**
     * Update data berdasarkan ID
     */
    public function update(int $id, array $data): bool {
        $sets   = implode(', ', array_map(fn($col) => "$col = ?", array_keys($data)));
        $stmt   = $this->db->prepare("UPDATE {$this->table} SET $sets WHERE {$this->primaryKey} = ?");
        $params = array_values($data);
        $params[] = $id;
        return $stmt->execute($params);
    }

    /**
     * Hapus data berdasarkan ID
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Cek apakah data exists
     */
    public function exists(array $conditions): bool {
        return $this->count($conditions) > 0;
    }
}
