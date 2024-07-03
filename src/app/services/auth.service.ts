import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    {username: 'admin', password: 'admin'},
    {username: 'user', password: 'user'},
  ];
  private isAuthenticated = false;

  constructor(private router: Router) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    this.isAuthenticated = isAuthenticated === 'true';
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(user => user.username === username && user.password === password);
    localStorage.setItem('isAuthenticated', 'true');
    if (user) {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  register(username: string, password: string): boolean {
    const user = this.users.find(user => user.username === username);
    if (user) {
      return false;
    }
    this.users.push({username, password});
    return true;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  autoLogin() {
    // Postavite potrebne podatke za automatsku prijavu korisnika
    this.isAuthenticated = true;
    localStorage.setItem('isAuthenticated', 'true');
    // ... ostali potrebni podaci ...
  }
}
