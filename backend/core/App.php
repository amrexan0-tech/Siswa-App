<?php
// core/App.php - Router utama aplikasi

class App {
    private string $controller = 'HomeController';
    private string $method     = 'index';
    private array  $params     = [];

    public function __construct() {
        $this->handleCors();
        $url = $this->parseUrl();
        $this->route($url);
    }

    /**
     * Handle CORS headers untuk komunikasi dengan frontend React
     */
    private function handleCors(): void {
        $allowedOrigins = [
            FRONTEND_URL,
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost',
            'http://127.0.0.1',
        ];
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, $allowedOrigins)) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            // Untuk window.open() / direct browser access, allow localhost
            header("Access-Control-Allow-Origin: *");
        }
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Auth-Token");
        header("Access-Control-Allow-Credentials: true");
        // JANGAN set Content-Type di sini — biarkan setiap controller yang menentukan
        // (export CSV butuh text/csv, bukan application/json)

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    /**
     * Parse URL menjadi segmen-segmen
     */
    private function parseUrl(): array {
        if (isset($_GET['url'])) {
            $url = rtrim($_GET['url'], '/');
            $url = filter_var($url, FILTER_SANITIZE_URL);
            return explode('/', $url);
        }
        return [];
    }

    /**
     * Route request ke controller & method yang sesuai
     */
    private function route(array $url): void {
        // Mapping route ke controller
        $routes = [
            'test'         => 'TestController',
            'auth'         => 'AuthController',
            'siswa'        => 'SiswaController',
            'kelas'        => 'KelasController',
            'jurusan'      => 'JurusanController',
            'tahun-ajaran' => 'TahunAjaranController',
            'users'        => 'UserController',
            'activity-logs'=> 'ActivityLogController',
            'dashboard'    => 'DashboardController',
            'upload'       => 'UploadController',
            'export'       => 'ExportController',
            'import'       => 'ImportController',
        ];

        $segment = $url[0] ?? '';

        if (isset($routes[$segment])) {
            $controllerName = $routes[$segment];
            $controllerFile = CONTROLLERS_PATH . $controllerName . '.php';

            if (file_exists($controllerFile)) {
                require_once $controllerFile;
                $controller = new $controllerName();

                // Tentukan method berdasarkan HTTP method & segmen URL
                $httpMethod = strtolower($_SERVER['REQUEST_METHOD']);
                $id         = $url[1] ?? null;
                $action     = $url[2] ?? null;

                $this->dispatch($controller, $httpMethod, $id, $action);
                return;
            }
        }

        // Default: tidak ditemukan
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
    }

    /**
     * Dispatch ke method controller berdasarkan HTTP method
     *
     * Pola URL yang didukung:
     *   /resource              → {httpMethod}All()
     *   /resource/{id}         → {httpMethod}One($id)      (id = numeric)
     *   /resource/{action}     → {httpMethod}{Action}()    (action = non-numeric, e.g. "csv")
     *   /resource/{id}/{action}→ {httpMethod}{Action}($id)
     */
    private function dispatch(object $controller, string $httpMethod, ?string $id, ?string $action): void {
        // Cek apakah $id sebenarnya adalah action (non-numeric string seperti "csv", "pdf")
        $idIsAction = ($id !== null && !is_numeric($id) && $action === null);

        if ($idIsAction) {
            // Pola: /resource/csv → getCsv(), /resource/pdf → getPdf()
            $method = $httpMethod . ucfirst($id);
            if (method_exists($controller, $method)) {
                $controller->$method();
                return;
            }
        }

        if ($action) {
            // Pola: /resource/{id}/profile → getProfile($id)
            $method = $httpMethod . ucfirst($action);
            if (method_exists($controller, $method)) {
                $controller->$method($id);
                return;
            }
        }

        if ($id !== null && !$idIsAction) {
            // Pola: /resource/{numericId} → getOne($id)
            $method = $httpMethod . 'One';
            if (method_exists($controller, $method)) {
                $controller->$method($id);
                return;
            }
        }

        // Pola: /resource → getAll()
        $method = $httpMethod . 'All';
        if (method_exists($controller, $method)) {
            $controller->$method();
            return;
        }

        http_response_code(405);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => false,
            'message' => "Method not allowed: $httpMethod " . get_class($controller),
        ]);
    }
}
