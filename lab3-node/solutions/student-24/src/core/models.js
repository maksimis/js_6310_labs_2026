// src/core/models.js
export class Task {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.status = 'To Do';
    this.history = ['To Do'];
    this.createdAt = new Date().toISOString();
  }

  moveTo(newStatus) {
    this.status = newStatus;
    this.history.push(newStatus);
  }

  getSteps() {
    // Количество шагов - это количество переходов (длина истории минус 1)
    return this.history.length - 1;
  }
}

export class Board {
  constructor() {
    this.tasks = [];
    // Лимиты WIP (Work In Progress). Для 'To Do' и 'Done' .
    this.wipLimits = {
      'To Do': 5,
      'In Progress': 3, 
      'Done': 5
    };
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getTasksByStatus(status) {
    return this.tasks.filter(t => t.status === status);
  }

  findTaskById(id) {
    return this.tasks.find(t => t.id === id);
  }

  canMoveTo(status) {
    const currentCount = this.getTasksByStatus(status).length;
    return currentCount < this.wipLimits[status];
  }

  moveTask(taskId, newStatus) {
    const task = this.findTaskById(taskId);
    if (!task) {
      throw new Error('Задача не найдена');
    }
    if (task.status === newStatus) {
      throw new Error('Задача уже в этой колонке');
    }
    if (!this.canMoveTo(newStatus)) {
      throw new Error(`Превышен лимит WIP для колонки ${newStatus}`);
    }
    
    task.moveTo(newStatus);
    return task;
  }

  getBoardState() {
    let state = '📋 Состояние доски:\n\n';
    for (const col of ['To Do', 'In Progress', 'Done']) {
      const tasks = this.getTasksByStatus(col);
      const limit = this.wipLimits[col] === Infinity ? '∞' : this.wipLimits[col];
      state += `[${col}] (${tasks.length}/${limit}):\n`;
      
      if (tasks.length === 0) {
        state += '  - пусто -\n';
      } else {
        tasks.forEach(t => {
          state += `  • [${t.id}] ${t.title}\n`;
        });
      }
      state += '\n';
    }
    return state;
  }
}