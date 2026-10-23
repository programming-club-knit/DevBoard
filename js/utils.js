export function calculateStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, pending, progress };
}

export function filterTasks(tasks, filters = {}) {
  const normalizedSearch = (filters.search || '').trim().toLowerCase();

  if (!normalizedSearch) {
    return tasks;
  }

  return tasks.filter((task) => task.title.toLowerCase().includes(normalizedSearch));
}

export function showNotification(message, type = 'success') {
  const notificationEl = document.getElementById('notification');
  if (!notificationEl) return;

  notificationEl.textContent = message;
  notificationEl.className = `notification ${type}`;
  notificationEl.classList.remove('hidden');

  window.clearTimeout(showNotification.timer);
  showNotification.timer = window.setTimeout(() => {
    notificationEl.classList.add('hidden');
  }, 2200);
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatRelativeDate(timestamp) {
  if (!timestamp) return 'just now';

  const created = new Date(timestamp);
  if (Number.isNaN(created.getTime())) return 'just now';

  const diffMinutes = Math.round((Date.now() - created.getTime()) / 60000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function applyTheme(theme) {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', safeTheme);

  const toggle = document.getElementById('theme-toggle');
  const themeText = document.querySelector('.theme-text');
  const themeIcon = document.querySelector('.theme-icon');

  if (!toggle || !themeText || !themeIcon) return;

  if (safeTheme === 'light') {
    themeText.textContent = 'Dark';
    themeIcon.textContent = '☾';
  } else {
    themeText.textContent = 'Light';
    themeIcon.textContent = '☀';
  }
}

export function persistTheme(theme) {
  return theme;
}

export function restoreTheme() {
  return 'dark';
}

export function loadSavedTasks() {
  return null;
}

export function saveTasks(tasks) {
  return tasks;
}
