import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { 
    path: 'users', 
    loadChildren: () => import('./users/users-module').then(m => m.UsersModule)
  },
  { 
    path: 'todo', 
    loadChildren: () => import('./todo/todo-module').then(m => m.TodoModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
