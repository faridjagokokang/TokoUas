const form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Lengkapi username & password');
    return;
  }

  localStorage.setItem('user', JSON.stringify({
    username,
    loginAt: new Date().toISOString()
  }));

  window.location.href = 'index.html';
});
