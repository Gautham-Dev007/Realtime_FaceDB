<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Face Capture Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { font-family: Arial, sans-serif; padding: 20px; }
  .hidden { display: none; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #ccc; padding: 8px; }
</style>
</head>
<body>

<!-- Login Form -->
<div id="login-section">
  <h2>Login</h2>
  <input id="username" placeholder="Username"><br><br>
  <input id="password" type="password" placeholder="Password"><br><br>
  <button onclick="login()">Login</button>
  <p id="login-error" style="color:red;"></p>
</div>

<!-- Dashboard -->
<div id="dashboard-section" class="hidden">
  <h2>Welcome, <span id="user-name"></span>!</h2>
  <button onclick="logout()">Logout</button>

  <!-- Admin Panel -->
  <div id="admin-panel" class="hidden">
    <h3>Admin Panel - User Activity</h3>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Last Accessed</th>
        </tr>
      </thead>
      <tbody id="user-activity"></tbody>
    </table>
  </div>
</div>

<script>
async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const res = await fetch('/.netlify/functions/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    localStorage.setItem('role', data.role);
    localStorage.setItem('username', username);
    showDashboard();
  } else {
    document.getElementById('login-error').textContent = "Invalid credentials";
  }
}

function showDashboard() {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('dashboard-section').classList.remove('hidden');
  document.getElementById('user-name').textContent = localStorage.getItem('username');

  if (localStorage.getItem('role') === 'admin') {
    document.getElementById('admin-panel').classList.remove('hidden');
    loadUserActivity();
  }
}

async function loadUserActivity() {
  const res = await fetch('/.netlify/functions/getUsers');
  const users = await res.json();

  const tbody = document.getElementById('user-activity');
  tbody.innerHTML = '';
  users.forEach(u => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${u.username}</td><td>${u.last_accessed || 'Never'}</td>`;
    tbody.appendChild(row);
  });
}

function logout() {
  localStorage.clear();
  location.reload();
}

// Auto-show dashboard if logged in
if (localStorage.getItem('username')) {
  showDashboard();
}
</script>

</body>
</html>
