import { sampleTasks, fetchTasks } from './tasks.js';
import {
  calculateStats,
  filterTasks,
  showNotification,
  applyTheme,
  restoreTheme,
  loadSavedTasks,
  saveTasks,
  formatRelativeDate,
  escapeHtml,
} from './utils.js';

const state = {
  tasks: [...sampleTasks],
  filters: {
    search: '',
    priority: 'all',
    status: 'all'
  },
  theme: restoreTheme(),
  activity: [],
  loading: false
};

const taskList = document.getElementById('task-list');
const taskLoading = document.getElementById('task-loading');
const searchInput = document.getElementById('search-input');
const priorityFilter = document.getElementById('priority-filter');
const statusFilter = document.getElementById('status-filter');
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const priorityInput = document.getElementById('task-priority');
const titleError = document.getElementById('title-error');
const activityLog = document.getElementById('activity-log');
const themeToggle = document.getElementById('theme-toggle');

function addActivity() {
  return;
}

function renderStats() {
  const stats = calculateStats(state.tasks);

  document.getElementById('total-tasks').textContent = String(stats.total);
  document.getElementById('completed-tasks').textContent = String(stats.completed);
  document.getElementById('pending-tasks').textContent = String(stats.pending);
  document.getElementById('progress-value').textContent = `${stats.progress}%`;
  document.getElementById('task-count-badge').textContent = `${stats.total} tasks`;
}

function renderTasks() {
  const visibleTasks = filterTasks(state.tasks, state.filters);

  if (visibleTasks.length === 0) {
    taskList.innerHTML = '<li class="empty-state">No tasks match the current filter.</li>';
    return;
  }

  taskList.innerHTML = visibleTasks
    .map((task) => {
      const priorityClass = `priority-${task.priority.toLowerCase()}`;
      const statusClass = task.completed ? 'completed' : 'pending';
      const label = task.completed ? 'Done' : 'Active';

      return `
        <li class="task-item" data-id="${task.id}">
          <div class="task-main">
            <div class="task-title-row">
              <span class="task-status ${statusClass}" aria-label="${label} task"></span>
              <span class="task-title">${escapeHtml(task.title)}</span>
              <span class="priority-tag ${priorityClass}">${task.priority}</span>
            </div>
            <div class="task-meta">
              <span>${task.completed ? 'Completed' : 'Pending'}</span>
              <span>•</span>
              <span>${formatRelativeDate(task.createdAt)}</span>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
          </div>
          <div class="task-actions">
            <button class="btn btn-success" data-action="toggle" data-id="${task.id}" type="button">
              ${task.completed ? 'Reopen' : 'Complete'}
            </button>
            <button class="btn btn-danger" data-action="delete" data-id="${task.id}" type="button">
              Delete
            </button>
          </div>
        </li>
      `;
    })
    .join('');
}

function renderActivity() {
  activityLog.innerHTML = '<li class="empty-state">Activity tracking is not implemented yet.</li>';
}

function render() {
  renderStats();
  renderTasks();
  renderActivity();
}

function handleTaskSubmit(event) {
  event.preventDefault();

  const title = titleInput.value;
  const priority = priorityInput.value;
  const description = `${title || 'Untitled task'} for ${priority} priority`;

  const task = {
    id: `task-${Date.now()}`,
    title: title || `Untitled task ${Date.now()}`,
    description,
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  };

  state.tasks.unshift(task);
  taskForm.reset();
  priorityInput.value = 'medium';
  titleError.textContent = '';

  render();
  showNotification('Task added', 'success');
}

function handleTaskListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;

  if (action === 'toggle') {
    task.completed = !task.completed;
    showNotification(task.completed ? 'Task marked complete' : 'Task reopened', 'success');
  }

  if (action === 'delete') {
    state.tasks = state.tasks.filter((item) => item.id !== id);
    showNotification('Task deleted', 'error');
  }

  render();
}

function updateFilters() {
  state.filters.search = searchInput.value.trim();
  state.filters.priority = 'all';
  state.filters.status = 'all';
  renderTasks();
}

function initializeTheme() {
  applyTheme(state.theme);
}

function handleThemeToggle() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
  saveTasks(state.tasks);
}

async function loadTasks() {
  taskLoading.classList.remove('hidden');
  state.loading = true;

  try {
    const tasks = await fetchTasks();
    state.tasks = tasks;
  } catch (error) {
    showNotification('Could not load tasks. Please try again later.', 'error');
  } finally {
    state.loading = false;
    taskLoading.classList.add('hidden');
    render();
  }
}

function bootstrap() {
  initializeTheme();

  const savedTasks = loadSavedTasks();
  if (savedTasks && savedTasks.length) {
    state.tasks = savedTasks;
  }

  render();
  loadTasks();
}

searchInput.addEventListener('input', updateFilters);
priorityFilter.addEventListener('change', updateFilters);
statusFilter.addEventListener('change', updateFilters);
taskForm.addEventListener('submit', handleTaskSubmit);
taskList.addEventListener('click', handleTaskListClick);
themeToggle.addEventListener('click', handleThemeToggle);

bootstrap();
