import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { UserList } from './user-list/user-list';
import { UserProfile } from './user-profile/user-profile';
import { Login } from './login/login';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserList,
    UserProfile,
    Login
  ],
  imports: [
    CommonModule,
    FormsModule, 
    UsersRoutingModule
  ]
})
export class UsersModule { }
