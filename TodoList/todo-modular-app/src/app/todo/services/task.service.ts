import { Injectable } from '@angular/core';
import { UserService } from '../../users/services/user.service';

export interface Task {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  priority: 'low' | 'medium' | 'high';
  userId: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Completar proyecto Angular',
      description: 'Terminar la aplicación de TODO con módulos',
      isDone: false,
      priority: 'high',
      userId: 1,
      createdAt: new Date('2025-01-10')
    },
    {
      id: 2,
      title: 'Estudiar directivas',
      description: 'Repasar *ngFor, *ngIf y [ngClass]',
      isDone: true,
      priority: 'medium',
      userId: 1,
      createdAt: new Date('2025-01-09')
    },
    {
      id: 3,
      title: 'Configurar servicios',
      description: 'Entender dependency injection',
      isDone: false,
      priority: 'low',
      userId: 2,
      createdAt: new Date('2025-01-08')
    },
    {
      id: 4,
      title: 'Hacer ejercicios',
      description: 'Practicar data binding',
      isDone: true,
      priority: 'medium',
      userId: 2,
      createdAt: new Date('2025-01-07')
    }
  ];

  private nextId = 5;

  constructor(private userService: UserService) { }

  // Obtener tareas del usuario actual
  getCurrentUserTasks(): Task[] {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    return this.tasks.filter(task => task.userId === currentUser.id);
  }

  // Obtener todas las tareas (solo para admin)
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // Obtener tarea por ID
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  // Agregar nueva tarea
  addTask(taskData: Partial<Task>): boolean {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    const newTask: Task = {
      id: this.nextId++,
      title: taskData.title || '',
      description: taskData.description || '',
      isDone: false,
      priority: taskData.priority || 'medium',
      userId: currentUser.id,
      createdAt: new Date()
    };

    this.tasks.push(newTask);
    return true;
  }

  // Actualizar tarea
  updateTask(id: number, taskData: Partial<Task>): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return false;
    }

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskData };
    return true;
  }

  // Marcar tarea como completada/pendiente
  toggleTaskComplete(id: number): boolean {
    const task = this.getTaskById(id);
    if (task) {
      task.isDone = !task.isDone;
      return true;
    }
    return false;
  }

  // Eliminar tarea
  deleteTask(id: number): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  // Obtener estadísticas del usuario actual
  getCurrentUserStats() {
    const userTasks = this.getCurrentUserTasks();
    return {
      total: userTasks.length,
      completed: userTasks.filter(task => task.isDone).length,
      pending: userTasks.filter(task => !task.isDone).length,
      highPriority: userTasks.filter(task => task.priority === 'high' && !task.isDone).length
    };
  }
}