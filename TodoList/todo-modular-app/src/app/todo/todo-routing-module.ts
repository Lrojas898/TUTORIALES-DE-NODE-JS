import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskList } from './task-list/task-list';
import { TaskForm } from './task-form/task-form';

const routes: Routes = [
  { path: '', component: TaskList },      // /todo
  { path: 'new', component: TaskForm },   // /todo/new
  { path: 'edit/:id', component: TaskForm } // /todo/edit/1
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }