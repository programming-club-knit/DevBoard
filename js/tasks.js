export const sampleTasks = [
  {
    id: 'task-1',
    title: 'Set up project overview section',
    description: 'Review dashboard structure and branding for the launch page.',
    priority: 'high',
    completed: true,
    createdAt: '2026-10-17T15:00:00.000Z'
  },
  {
    id: 'task-2',
    title: 'Refine task form UX',
    description: 'Improve spacing, inline feedback, and clarity of task actions.',
    priority: 'medium',
    completed: false,
    createdAt: '2026-10-18T09:30:00.000Z'
  },
  {
    id: 'task-3',
    title: 'Fix mobile card overflow',
    description: 'Stretch testing across smaller widths and improve compact layout.',
    priority: 'high',
    completed: false,
    createdAt: '2026-10-19T12:15:00.000Z'
  },
  {
    id: 'task-4',
    title: 'Document bug triage process',
    description: 'Create contributor notes for reliable issue handling and fix flow.',
    priority: 'low',
    completed: false,
    createdAt: '2026-10-20T08:45:00.000Z'
  }
];

export function fetchTasks() {
  return Promise.resolve(sampleTasks.map((task) => ({ ...task })));
}
