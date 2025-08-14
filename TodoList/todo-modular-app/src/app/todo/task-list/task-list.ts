import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task, TaskService } from '../services/task.service';
import { UserService } from '../../users/services/user.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
  standalone: false
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  stats: any = {};
  currentUserName: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUserLogin();
    if (this.isLoggedIn) {
      this.loadTasks();
      this.loadStats();
    }
  }

  checkUserLogin(): void {
    const currentUser = this.userService.getCurrentUser();
    this.isLoggedIn = !!currentUser;
    this.currentUserName = currentUser?.name || '';
    
    if (!this.isLoggedIn) {
      
    }
  }

  loadTasks(): void {
    this.tasks = this.taskService.getCurrentUserTasks();
  }

  loadStats(): void {
    this.stats = this.taskService.getCurrentUserStats();
  }

  onToggleComplete(taskId: number): void {
    this.taskService.toggleTaskComplete(taskId);
    this.loadTasks();
    this.loadStats();
  }

  onDeleteTask(taskId: number): void {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId);
      this.loadTasks();
      this.loadStats();
    }
  }

  onEditTask(taskId: number): void {
    this.router.navigate(['/todo/edit', taskId]);
  }

  onCreateTask(): void {
    this.router.navigate(['/todo/new']);
  }

  goToLogin(): void {
    this.router.navigate(['/users/login']);
  }
}