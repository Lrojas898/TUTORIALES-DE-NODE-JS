import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TodoRoutingModule } from './todo-routing-module';
import { TaskList } from './task-list/task-list';
import { TaskForm } from './task-form/task-form';
import { TaskItem } from './task-item/task-item';

@NgModule({
  declarations: [
    TaskList,
    TaskForm,
    TaskItem
  ],
  imports: [
    CommonModule,        // *ngIf, *ngFor, etc.
    FormsModule,         // [(ngModel)]
    TodoRoutingModule    // Rutas del módulo todo
  ]
})
export class TodoModule { }