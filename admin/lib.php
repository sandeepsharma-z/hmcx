<?php
declare(strict_types=1);

const HMCX_ADMIN_USERNAME = 'sandeepsharma909909@';
const HMCX_ADMIN_PASSWORD_HASH = '$2y$10$ch.l0PZ6Q7JcdH.ef1/XOeQbwSBzc1AoX/rR/d9rdzRUL7QuB96v.';
const HMCX_DB_RELATIVE_PATH = __DIR__ . '/../storage/hmcx.sqlite';

function hmcx_session_start_secure(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    ini_set('session.use_strict_mode', '1');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Strict');

    session_name('HMCXADMINSESSID');
    session_start([
        'cookie_lifetime' => 0,
        'cookie_path' => '/',
        'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict',
    ]);
}

function hmcx_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dir = dirname(HMCX_DB_RELATIVE_PATH);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $pdo = new PDO('sqlite:' . HMCX_DB_RELATIVE_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            country TEXT,
            service TEXT,
            budget TEXT,
            timeline TEXT,
            message TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            created_at TEXT NOT NULL
        )'
    );

    return $pdo;
}

function hmcx_save_submission(array $data): bool
{
    $stmt = hmcx_db()->prepare(
        'INSERT INTO submissions
        (name, email, phone, company, country, service, budget, timeline, message, ip_address, user_agent, created_at)
        VALUES
        (:name, :email, :phone, :company, :country, :service, :budget, :timeline, :message, :ip, :ua, :created_at)'
    );

    return $stmt->execute([
        ':name' => $data['name'] ?? '',
        ':email' => $data['email'] ?? '',
        ':phone' => $data['phone'] ?? '',
        ':company' => $data['company'] ?? '',
        ':country' => $data['country'] ?? '',
        ':service' => $data['service'] ?? '',
        ':budget' => $data['budget'] ?? '',
        ':timeline' => $data['timeline'] ?? '',
        ':message' => $data['message'] ?? '',
        ':ip' => $data['ip_address'] ?? '',
        ':ua' => $data['user_agent'] ?? '',
        ':created_at' => gmdate('Y-m-d H:i:s'),
    ]);
}

function hmcx_fetch_submissions(int $limit = 200): array
{
    $limit = max(1, min(1000, $limit));
    $stmt = hmcx_db()->query('SELECT * FROM submissions ORDER BY id DESC LIMIT ' . $limit);
    return $stmt->fetchAll();
}

function hmcx_fetch_submission(int $id): ?array
{
    $stmt = hmcx_db()->prepare('SELECT * FROM submissions WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function hmcx_is_logged_in(): bool
{
    hmcx_session_start_secure();
    return !empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function hmcx_require_login(): void
{
    if (!hmcx_is_logged_in()) {
        header('Location: index.php');
        exit;
    }
}

function hmcx_login(string $username, string $password): bool
{
    hmcx_session_start_secure();
    if (!hash_equals(HMCX_ADMIN_USERNAME, $username)) {
        return false;
    }
    if (!password_verify($password, HMCX_ADMIN_PASSWORD_HASH)) {
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_user'] = HMCX_ADMIN_USERNAME;
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return true;
}

function hmcx_logout(): void
{
    hmcx_session_start_secure();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool)$params['secure'], (bool)$params['httponly']);
    }
    session_destroy();
}

function hmcx_csrf_token(): string
{
    hmcx_session_start_secure();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function hmcx_verify_csrf(?string $token): bool
{
    hmcx_session_start_secure();
    return is_string($token) && !empty($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function hmcx_e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

