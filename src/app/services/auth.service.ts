import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

interface UserData{
  email: string;
  name: string;
  surname: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private router: Router, private http: HttpClient) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    this.isAuthenticated = isAuthenticated === 'true';
  }

  login(userData: UserData){
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
      {email:userData.email, password:userData.password,returnSecureToken:true}
    );
  }

  register(userData: UserData){
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
      {email:userData.email, password:userData.password,returnSecureToken:true}
    );
  }

  async logout(): Promise<void> {
    try {
      await this.http.post<AuthResponse>('/api/logout', {}).toPromise();
      localStorage.removeItem('isAuthenticated');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error', error);
    }
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  autoLogin() {
    // Postavite potrebne podatke za automatsku prijavu korisnika
    localStorage.setItem('isAuthenticated', 'true');
    // ... ostali potrebni podaci ...
  }
}
