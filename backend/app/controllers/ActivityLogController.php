<?php
class ActivityLogController extends BaseController {
    private ActivityLogModel $model;

    public function __construct() {
        $this->model = new ActivityLogModel();
    }

    public function getAll(): void {
        $this->requireAuth();
        $pagination = $this->getPagination();
        $data  = $this->model->findAllWithUser($pagination['limit'], $pagination['offset']);
        $total = $this->model->count();
        $this->success([
            'items'       => $data,
            'total'       => $total,
            'page'        => $pagination['page'],
            'limit'       => $pagination['limit'],
            'total_pages' => ceil($total / $pagination['limit']),
        ]);
    }
}
