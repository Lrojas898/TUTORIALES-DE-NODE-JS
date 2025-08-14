import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = '';
  loginMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  onLogin(): void {
    if (this.userService.login(this.email)) {
      this.loginMessage = 'Login exitoso!';
      setTimeout(() => {
        this.router.navigate(['/users/profile']);
      }, 1000);
    } else {
      this.loginMessage = 'Email no válido o usuario inactivo';
    }
  }
}