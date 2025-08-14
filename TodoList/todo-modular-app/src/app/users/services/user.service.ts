import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', isActive: true },
    { id: 2, name: 'María García', email: 'maria@ejemplo.com', isActive: true },
    { id: 3, name: 'Carlos López', email: 'carlos@ejemplo.com', isActive: false }
  ];

  private currentUser: User | null = null;

  constructor() { }

  // Obtener todos los usuarios
  getUsers(): User[] {
    return this.users;
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Simular login
  login(email: string): boolean {
    const user = this.users.find(u => u.email === email && u.isActive);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  // Logout
  logout(): void {
    this.currentUser = null;
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}