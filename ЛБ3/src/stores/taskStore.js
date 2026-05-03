import { defineStore } from 'pinia'

const STORAGE_KEY = 'advanced-js-lab3-task-manager'

export const TASK_STATUSES = ['active', 'completed']
export const TASK_PRIORITIES = ['low', 'medium', 'high']
export const TASK_CATEGORIES = ['Study', 'Work', 'Personal', 'Other']

const today = new Date()
const tomorrow = addDays(today, 1)
const twoDaysLater = addDays(today, 2)
const yesterday = addDays(today, -1)

const demoTasks = [
  {
    id: 'demo-1',
    title: 'Prepare Advanced JavaScript notes',
    description: 'Review Vue Router, Pinia stores, and localStorage persistence before the seminar.',
    category: 'Study',
    priority: 'high',
    deadline: toDateInputValue(tomorrow),
    status: 'active',
    createdAt: toIsoDate(addDays(today, -4)),
    updatedAt: toIsoDate(addDays(today, -2)),
  },
  {
    id: 'demo-2',
    title: 'Finish project report',
    description: 'Collect screenshots, describe implemented features, and prepare the final submission.',
    category: 'Work',
    priority: 'medium',
    deadline: toDateInputValue(twoDaysLater),
    status: 'active',
    createdAt: toIsoDate(addDays(today, -3)),
    updatedAt: toIsoDate(addDays(today, -1)),
  },
  {
    id: 'demo-3',
    title: 'Submit previous homework',
    description: 'This task is intentionally overdue so the overdue highlighting and statistics are visible.',
    category: 'Study',
    priority: 'high',
    deadline: toDateInputValue(yesterday),
    status: 'active',
    createdAt: toIsoDate(addDays(today, -6)),
    updatedAt: toIsoDate(addDays(today, -5)),
  },
  {
    id: 'demo-4',
    title: 'Clean up desk',
    description: 'Organize notes and remove old drafts after completing the work session.',
    category: 'Personal',
    priority: 'low',
    deadline: toDateInputValue(addDays(today, 5)),
    status: 'completed',
    createdAt: toIsoDate(addDays(today, -8)),
    updatedAt: toIsoDate(addDays(today, -1)),
  },
]

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: loadStoredTasks(),
  }),

  getters: {
    activeTasks: (state) => state.tasks.filter((task) => task.status === 'active'),
    completedTasks: (state) => state.tasks.filter((task) => task.status === 'completed'),
    overdueTasks: (state) => state.tasks.filter((task) => isTaskOverdue(task)),
    tasksByCategory: (state) => {
      return state.tasks.reduce((counts, task) => {
        counts[task.category] = (counts[task.category] || 0) + 1
        return counts
      }, createCategoryCounts())
    },
    totalTasks: (state) => state.tasks.length,
    tasksByStatus: (state) => {
      return state.tasks.reduce(
        (counts, task) => {
          counts[task.status] = (counts[task.status] || 0) + 1
          return counts
        },
        { active: 0, completed: 0 },
      )
    },
    upcomingDeadlines: (state) => {
      const start = startOfDay(new Date())
      const end = addDays(start, 3)

      return state.tasks
        .filter((task) => {
          const deadline = parseDeadline(task.deadline)
          return task.status === 'active' && deadline && deadline >= start && deadline <= end
        })
        .sort((first, second) => parseDeadline(first.deadline) - parseDeadline(second.deadline))
    },
    completionPercent: (state) => {
      if (state.tasks.length === 0) {
        return 0
      }

      const completedCount = state.tasks.filter((task) => task.status === 'completed').length
      return Math.round((completedCount / state.tasks.length) * 100)
    },
    getTaskById: (state) => {
      return (id) => state.tasks.find((task) => String(task.id) === String(id))
    },
  },

  actions: {
    addTask(taskData) {
      const timestamp = new Date().toISOString()
      const task = normalizeTask({
        ...taskData,
        id: createTaskId(),
        createdAt: timestamp,
        updatedAt: timestamp,
      })

      this.tasks.push(task)
      this.saveToStorage()
      return task
    },

    updateTask(id, taskData) {
      const taskIndex = this.tasks.findIndex((task) => String(task.id) === String(id))

      if (taskIndex === -1) {
        return null
      }

      const updatedTask = normalizeTask({
        ...this.tasks[taskIndex],
        ...taskData,
        id: this.tasks[taskIndex].id,
        createdAt: this.tasks[taskIndex].createdAt,
        updatedAt: new Date().toISOString(),
      })

      this.tasks.splice(taskIndex, 1, updatedTask)
      this.saveToStorage()
      return updatedTask
    },

    deleteTask(id) {
      const initialLength = this.tasks.length
      this.tasks = this.tasks.filter((task) => String(task.id) !== String(id))
      const wasDeleted = this.tasks.length !== initialLength

      if (wasDeleted) {
        this.saveToStorage()
      }

      return wasDeleted
    },

    toggleTaskStatus(id) {
      const task = this.getTaskById(id)

      if (!task) {
        return null
      }

      const nextStatus = task.status === 'completed' ? 'active' : 'completed'
      return this.setTaskStatus(id, nextStatus)
    },

    setTaskStatus(id, status) {
      if (!TASK_STATUSES.includes(status)) {
        return null
      }

      return this.updateTask(id, { status })
    },

    loadFromStorage() {
      this.tasks = loadStoredTasks()
    },

    saveToStorage() {
      if (typeof localStorage === 'undefined') {
        return
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
    },
  },
})

function loadStoredTasks() {
  if (typeof localStorage === 'undefined') {
    return cloneDemoTasks()
  }

  const savedTasks = localStorage.getItem(STORAGE_KEY)

  if (savedTasks === null) {
    return cloneDemoTasks()
  }

  try {
    const parsedTasks = JSON.parse(savedTasks)
    return Array.isArray(parsedTasks) ? parsedTasks.map(normalizeTask) : cloneDemoTasks()
  } catch {
    return cloneDemoTasks()
  }
}

function normalizeTask(task) {
  const timestamp = new Date().toISOString()

  return {
    id: task.id ?? createTaskId(),
    title: String(task.title ?? '').trim(),
    description: String(task.description ?? '').trim(),
    category: TASK_CATEGORIES.includes(task.category) ? task.category : 'Other',
    priority: TASK_PRIORITIES.includes(task.priority) ? task.priority : 'medium',
    deadline: task.deadline ?? '',
    status: TASK_STATUSES.includes(task.status) ? task.status : 'active',
    createdAt: task.createdAt ?? timestamp,
    updatedAt: task.updatedAt ?? timestamp,
  }
}

function cloneDemoTasks() {
  return demoTasks.map((task) => ({ ...task }))
}

function createCategoryCounts() {
  return TASK_CATEGORIES.reduce((counts, category) => {
    counts[category] = 0
    return counts
  }, {})
}

function createTaskId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function isTaskOverdue(task) {
  const deadline = parseDeadline(task.deadline)
  return task.status === 'active' && deadline !== null && deadline < startOfDay(new Date())
}

function parseDeadline(deadline) {
  if (!deadline) {
    return null
  }

  const [year, month, day] = deadline.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return startOfDay(new Date(year, month - 1, day))
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date, days) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toIsoDate(date) {
  return date.toISOString()
}
