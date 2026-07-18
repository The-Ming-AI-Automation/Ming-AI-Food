const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const toast = $('#toast');
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

const themeToggle = $('#themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☾' : '☼';
    localStorage.setItem('ming-theme', isDark ? 'dark' : 'light');
  });
  if (localStorage.getItem('ming-theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☾';
  }
}
