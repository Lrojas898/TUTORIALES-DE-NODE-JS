import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserList } from './user-list/user-list';           
import { UserProfile } from './user-profile/user-profile';     
import { Login } from './login/login';                       

const routes: Routes = [
  { path: '', component: UserList },          // /users
  { path: 'profile', component: UserProfile }, // /users/profile
  { path: 'login', component: Login }          // /users/login
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }