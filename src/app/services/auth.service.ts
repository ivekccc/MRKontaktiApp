import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import { tap, map, switchMap, take } from 'rxjs/operators';
import { Database, ref, push } from '@angular/fire/database';

interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

interface UserData {
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
  private _user = new BehaviorSubject<User | null>(null);

  constructor(private router: Router, private http: HttpClient, private db: Database) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      this.autoLogin();
    }
  }

  login(userData: UserData) {
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`, {
      email: userData.email,
      password: userData.password,
      returnSecureToken: true
    }).pipe(tap((authResponse) => {
      const expirationTime = new Date(new Date().getTime() + (+authResponse.expiresIn * 1000));
      const user = new User(authResponse.localId, authResponse.email, authResponse.idToken, expirationTime);
      this._user.next(user);
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    }));
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        }
        return null;
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.getToken();
        }
        return null;
      })
    );
  }

  public getAuthStatus() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.getToken();
        }
        return false;
      })
    );
  }

  register(userData: UserData) {
    this.isAuthenticated = true;
    return this.http.post<AuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
      {
        email: userData.email,
        password: userData.password,
        returnSecureToken: true
      }
    ).pipe(
      tap((authResponse) => {
        const expirationTime = new Date(new Date().getTime() + (+authResponse.expiresIn * 1000));
        const user = new User(authResponse.localId, authResponse.email, authResponse.idToken, expirationTime);
        this._user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        const usersRef = ref(this.db, 'users');
        const newUserRef = push(usersRef);
        const newUserId = newUserRef.key;
        if (!newUserId) {
          throw new Error('Failed to generate a new user ID');
        }

        const newUser = {
          id: newUserId,
          email: userData.email,
          name: userData.name,
          surname: userData.surname,
        };

        this.token.pipe(
          take(1),
          switchMap((token) => {
            return this.http.put(
              `https://mrkontakti-default-rtdb.europe-west1.firebasedatabase.app/users/${newUserId}.json?auth=${token}`,
              newUser
            );
          })
        ).subscribe({
          next: () => {
            console.log('User added to database:', newUser);
          },
          error: (error) => {
            console.error('Failed to add user to database:', error);
          }
        });
      })
    );
  }

  async logout() {
    this._user.next(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  autoLogin() {
    const userData: {
      id: string;
      email: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData || !userData._token) {
      return;
    }

    const loadedUser = new User(userData.id, userData.email, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.getToken()) {
      this._user.next(loadedUser);
      const currentUrl = localStorage.getItem('currentUrl') || '/contacts';
      this.router.navigate([currentUrl]);
    }
  }
}
