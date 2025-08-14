import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.css'],
  standalone: false
})
export class TaskItem {
  @Input() task!: Task;
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<number>();

  onToggleComplete(): void {
    this.toggleComplete.emit(this.task.id);
  }

  onDelete(): void {
    this.deleteTask.emit(this.task.id);
  }

  onEdit(): void {
    this.editTask.emit(this.task.id);
  }

  getPriorityIcon(): string {
    switch (this.task.priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  getPriorityText(): string {
    switch (this.task.priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}