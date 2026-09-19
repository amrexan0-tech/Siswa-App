<?php
class ActivityLogModel extends BaseModel {
    protected string $table = 'activity_logs';

    public function findAllWithUser(int $limit = 50, int $offset = 0): array {
        $stmt = $this->db->prepare(
            "SELECT al.*, u.username
             FROM activity_logs al
             LEFT JOIN users u ON al.user_id = u.id
             ORDER BY al.created_at DESC
             LIMIT $limit OFFSET $offset"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
