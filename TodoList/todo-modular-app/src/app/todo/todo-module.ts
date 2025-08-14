import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    CommonModule,
    TodoRoutingModule
  ]
})
export class TodoModule { }
