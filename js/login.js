const form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Lengkapi username & password');
    return;
  }

  // Simpan session sederhana
  localStorage.setItem('user', JSON.stringify({
    username
  }));

  // Redirect ke app
  window.location.href = 'index.html';
});