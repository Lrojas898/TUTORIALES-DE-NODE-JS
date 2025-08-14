import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task, TaskService } from '../services/task.service';
import { UserService } from '../../users/services/user.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css'],
  standalone: false
})
export class TaskForm implements OnInit {
  task: Partial<Task> = {
    title: '',
    description: '',
    priority: 'medium'
  };
  
  isEditing: boolean = false;
  taskId: number | null = null;
  isLoggedIn: boolean = false;
  currentUserName: string = '';
  saveMessage: string = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkUserLogin();
    this.checkIfEditing();
  }

  checkUserLogin(): void {
    const currentUser = this.userService.getCurrentUser();
    this.isLoggedIn = !!currentUser;
    this.currentUserName = currentUser?.name || '';
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/users/login']);
    }
  }

  checkIfEditing(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.taskId = parseInt(id, 10);
      this.loadTask();
    }
  }

  loadTask(): void {
    if (this.taskId) {
      const existingTask = this.taskService.getTaskById(this.taskId);
      if (existingTask) {
        this.task = { ...existingTask };
      } else {
        this.saveMessage = 'Tarea no encontrada';
        setTimeout(() => this.goBack(), 2000);
      }
    }
  }

  onSubmit(): void {
    if (!this.isLoggedIn) {
      return;
    }

    if (!this.task.title?.trim()) {
      this.saveMessage = 'El título es obligatorio';
      return;
    }

    let success = false;

    if (this.isEditing && this.taskId) {
      success = this.taskService.updateTask(this.taskId, this.task);
      this.saveMessage = success ? 'Tarea actualizada correctamente' : 'Error al actualizar la tarea';
    } else {
      success = this.taskService.addTask(this.task);
      this.saveMessage = success ? 'Tarea creada correctamente' : 'Error al crear la tarea';
    }

    if (success) {
      setTimeout(() => {
        this.router.navigate(['/todo']);
      }, 1500);
    }
  }

  onCancel(): void {
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/todo']);
  }

  goToLogin(): void {
    this.router.navigate(['/users/login']);
  }
}