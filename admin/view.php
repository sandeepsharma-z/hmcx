<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';
hmcx_require_login();

$id = (int)($_GET['id'] ?? 0);
$item = $id > 0 ? hmcx_fetch_submission($id) : null;
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Inquiry Detail</title>
  <style>
    :root { --b1:#0f2f75; --b2:#2c7be5; --bg:#f3f7ff; --bd:#d7e2fb; --tx:#0f2344; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Segoe UI,system-ui,sans-serif; background:var(--bg); color:var(--tx); }
    .top { display:flex; justify-content:space-between; align-items:center; padding:14px 20px; background:linear-gradient(135deg,var(--b1),var(--b2)); color:#fff; }
    .top a { color:#fff; text-decoration:none; border:1px solid rgba(255,255,255,.35); padding:8px 12px; border-radius:10px; font-size:.86rem; }
    .wrap { max-width:860px; margin:20px auto; padding:0 14px; }
    .card { background:#fff; border:1px solid var(--bd); border-radius:14px; padding:18px; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
    .f { border:1px solid #edf2ff; border-radius:10px; padding:10px; }
    .k { font-size:.74rem; color:#617aa6; text-transform:uppercase; letter-spacing:.06em; margin-bottom:4px; }
    .v { font-size:.95rem; color:#0f2344; white-space:pre-wrap; word-wrap:break-word; }
    @media (max-width:760px){ .grid{grid-template-columns:1fr;} }
  </style>
</head>
<body>
  <div class="top">
    <strong>Inquiry Detail</strong>
    <div>
      <a href="dashboard.php">Back</a>
      <a href="logout.php">Logout</a>
    </div>
  </div>
  <div class="wrap">
    <div class="card">
      <?php if (!$item): ?>
        <p>Submission not found.</p>
      <?php else: ?>
        <div class="grid">
          <div class="f"><div class="k">ID</div><div class="v"><?php echo (int)$item['id']; ?></div></div>
          <div class="f"><div class="k">Date (UTC)</div><div class="v"><?php echo hmcx_e((string)$item['created_at']); ?></div></div>
          <div class="f"><div class="k">Name</div><div class="v"><?php echo hmcx_e((string)$item['name']); ?></div></div>
          <div class="f"><div class="k">Email</div><div class="v"><?php echo hmcx_e((string)$item['email']); ?></div></div>
          <div class="f"><div class="k">Phone</div><div class="v"><?php echo hmcx_e((string)$item['phone']); ?></div></div>
          <div class="f"><div class="k">Company</div><div class="v"><?php echo hmcx_e((string)$item['company']); ?></div></div>
          <div class="f"><div class="k">Country</div><div class="v"><?php echo hmcx_e((string)$item['country']); ?></div></div>
          <div class="f"><div class="k">Service</div><div class="v"><?php echo hmcx_e((string)$item['service']); ?></div></div>
          <div class="f"><div class="k">Budget</div><div class="v"><?php echo hmcx_e((string)$item['budget']); ?></div></div>
          <div class="f"><div class="k">Timeline</div><div class="v"><?php echo hmcx_e((string)$item['timeline']); ?></div></div>
          <div class="f"><div class="k">IP Address</div><div class="v"><?php echo hmcx_e((string)$item['ip_address']); ?></div></div>
          <div class="f"><div class="k">User Agent</div><div class="v"><?php echo hmcx_e((string)$item['user_agent']); ?></div></div>
        </div>
        <div class="f">
          <div class="k">Message</div>
          <div class="v"><?php echo hmcx_e((string)$item['message']); ?></div>
        </div>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>

