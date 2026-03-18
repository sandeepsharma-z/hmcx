<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';

hmcx_session_start_secure();
if (hmcx_is_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$now = time();
$lockUntil = (int)($_SESSION['login_lock_until'] ?? 0);
$isLocked = $lockUntil > $now;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$isLocked) {
    $token = $_POST['csrf_token'] ?? '';
    $username = trim((string)($_POST['username'] ?? ''));
    $password = (string)($_POST['password'] ?? '');

    if (!hmcx_verify_csrf($token)) {
        $error = 'Security token mismatch. Refresh and try again.';
    } elseif (hmcx_login($username, $password)) {
        unset($_SESSION['login_fail_count'], $_SESSION['login_lock_until']);
        header('Location: dashboard.php');
        exit;
    } else {
        $fails = ((int)($_SESSION['login_fail_count'] ?? 0)) + 1;
        $_SESSION['login_fail_count'] = $fails;
        if ($fails >= 5) {
            $_SESSION['login_lock_until'] = time() + 300;
            $error = 'Too many failed attempts. Try again in 5 minutes.';
        } else {
            $error = 'Invalid username or password.';
        }
    }
}

if ($isLocked) {
    $left = max(1, $lockUntil - $now);
    $error = 'Login temporarily locked. Retry in ' . $left . ' seconds.';
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>HMCX Admin Login</title>
  <style>
    :root { --b1:#0f2f75; --b2:#2c7be5; --bg:#eff4ff; --bd:#cfdcf9; --txt:#102447; }
    * { box-sizing:border-box; }
    body {
      margin:0; min-height:100vh; display:grid; place-items:center; font-family:Segoe UI,system-ui,sans-serif;
      background: radial-gradient(circle at 20% 10%, #dbeafe 0, transparent 40%),
                  radial-gradient(circle at 80% 90%, #bfdbfe 0, transparent 42%),
                  var(--bg);
      color:var(--txt);
    }
    .card {
      width:min(430px,92vw); background:#fff; border:1px solid var(--bd); border-radius:20px; padding:30px;
      box-shadow:0 24px 70px rgba(12,43,104,.18);
    }
    h1 { margin:0 0 8px; font-size:1.5rem; }
    p { margin:0 0 18px; color:#567; font-size:.95rem; }
    label { display:block; font-size:.85rem; margin-bottom:6px; font-weight:600; }
    input {
      width:100%; padding:12px 14px; border-radius:12px; border:1px solid var(--bd); outline:none;
      font-size:.95rem; margin-bottom:14px;
    }
    input:focus { border-color:#2c7be5; box-shadow:0 0 0 3px rgba(44,123,229,.15); }
    button {
      width:100%; border:none; border-radius:12px; padding:13px 16px; color:#fff; font-weight:700; font-size:1rem;
      background:linear-gradient(135deg,var(--b1),var(--b2)); cursor:pointer;
    }
    .err { margin:0 0 14px; padding:10px 12px; border-radius:10px; border:1px solid #f5b5b5; background:#fff1f1; color:#b42318; font-size:.88rem; }
    .meta { margin-top:12px; font-size:.8rem; color:#678; text-align:center; }
  </style>
</head>
<body>
  <form class="card" method="post" autocomplete="off">
    <h1>Admin Login</h1>
    <p>Secure dashboard access</p>
    <?php if ($error !== ''): ?>
      <div class="err"><?php echo hmcx_e($error); ?></div>
    <?php endif; ?>
    <input type="hidden" name="csrf_token" value="<?php echo hmcx_e(hmcx_csrf_token()); ?>">
    <label for="username">Username</label>
    <input id="username" name="username" required>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required>
    <button type="submit">Sign In</button>
    <div class="meta">HmcxStudio Admin Panel</div>
  </form>
</body>
</html>

