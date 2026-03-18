<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';
hmcx_require_login();

$rows = hmcx_fetch_submissions(500);
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>HMCX Admin Dashboard</title>
  <style>
    :root { --b1:#0f2f75; --b2:#2c7be5; --bg:#f3f7ff; --bd:#d7e2fb; --tx:#0f2344; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Segoe UI,system-ui,sans-serif; background:var(--bg); color:var(--tx); }
    .top {
      position:sticky; top:0; z-index:9; display:flex; justify-content:space-between; align-items:center; gap:12px;
      padding:14px 20px; background:linear-gradient(135deg,var(--b1),var(--b2)); color:#fff;
    }
    .top h1 { margin:0; font-size:1.1rem; }
    .top a { color:#fff; text-decoration:none; border:1px solid rgba(255,255,255,.35); padding:8px 12px; border-radius:10px; font-size:.86rem; }
    .wrap { max-width:1200px; margin:20px auto; padding:0 14px; }
    .stats {
      display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-bottom:16px;
    }
    .card {
      background:#fff; border:1px solid var(--bd); border-radius:14px; padding:14px;
    }
    .card .k { font-size:.78rem; color:#617aa6; text-transform:uppercase; letter-spacing:.06em; }
    .card .v { font-size:1.4rem; font-weight:800; margin-top:6px; }
    .table {
      background:#fff; border:1px solid var(--bd); border-radius:14px; overflow:auto;
    }
    table { width:100%; border-collapse:collapse; min-width:940px; }
    th, td { padding:11px 12px; border-bottom:1px solid #edf2ff; font-size:.86rem; text-align:left; vertical-align:top; }
    th { background:#f8fbff; color:#3a5178; font-size:.79rem; text-transform:uppercase; letter-spacing:.05em; }
    tr:hover td { background:#f9fbff; }
    .msg { max-width:380px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#425f8f; }
    .view { color:#1f5fd3; text-decoration:none; font-weight:600; }
    .empty { padding:20px; color:#5a729c; }
    @media (max-width:760px){ .stats{grid-template-columns:1fr;} }
  </style>
</head>
<body>
  <div class="top">
    <h1>HmcxStudio Admin Inbox</h1>
    <div>
      <a href="dashboard.php">Refresh</a>
      <a href="logout.php">Logout</a>
    </div>
  </div>
  <div class="wrap">
    <div class="stats">
      <div class="card"><div class="k">Total Inquiries</div><div class="v"><?php echo count($rows); ?></div></div>
      <div class="card"><div class="k">Latest Date (UTC)</div><div class="v" style="font-size:1rem;"><?php echo count($rows) ? hmcx_e($rows[0]['created_at']) : '-'; ?></div></div>
      <div class="card"><div class="k">Admin User</div><div class="v" style="font-size:1rem;"><?php echo hmcx_e((string)($_SESSION['admin_user'] ?? '')); ?></div></div>
    </div>

    <div class="table">
      <?php if (!$rows): ?>
        <div class="empty">No submissions yet.</div>
      <?php else: ?>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date (UTC)</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Budget</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        <?php foreach ($rows as $r): ?>
          <tr>
            <td><?php echo (int)$r['id']; ?></td>
            <td><?php echo hmcx_e((string)$r['created_at']); ?></td>
            <td><?php echo hmcx_e((string)$r['name']); ?></td>
            <td><?php echo hmcx_e((string)$r['email']); ?></td>
            <td><?php echo hmcx_e((string)$r['phone']); ?></td>
            <td><?php echo hmcx_e((string)$r['service']); ?></td>
            <td><?php echo hmcx_e((string)$r['budget']); ?></td>
            <td><div class="msg"><?php echo hmcx_e((string)$r['message']); ?></div></td>
            <td><a class="view" href="view.php?id=<?php echo (int)$r['id']; ?>">Open</a></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>

