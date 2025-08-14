import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {
  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    
    // Si no hay usuario logueado, redirigir al login
    if (!this.currentUser) {
      this.router.navigate(['/users/login']);
    }
  }

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['/users']);
  }
}