import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../user.model';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';



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
  private _user = new BehaviorSubject<User | null>(null); // Promenjen tip na 'User | null'

  constructor(private router: Router, private http: HttpClient) {

    const isAuthenticated = localStorage.getItem('isAuthenticated');
    this.isAuthenticated = isAuthenticated === 'true';
  }

  login(userData: UserData){
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
      {email:userData.email, password:userData.password,returnSecureToken:true}
    ).pipe(tap((userData)=>{
      const exparationTime=new Date(new Date().getTime()+(+userData.expiresIn * 1000));
      const user=new User(userData.localId,userData.email,userData.idToken,exparationTime);
      this._user.next(user);
    })
  );
  }

  public getAuthStatus(){
    return this._user.asObservable().pipe(
      map((user)=>{
        if(user){
          return !!user.getToken();
        }
        return false;
      })
    );
  }

  register(userData: UserData){
    this.isAuthenticated = true;
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
      {email:userData.email, password:userData.password,returnSecureToken:true}
    ).pipe(tap((userData)=>{
      const exparationTime=new Date(new Date().getTime()+(+userData.expiresIn * 1000));
      const user=new User(userData.localId,userData.email,userData.idToken,exparationTime);
      this._user.next(user);
    }));
  }

  async logout() {
    this._user.next(null);
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
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
