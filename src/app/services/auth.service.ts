import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // Izmenjeno
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null> = this.afAuth.user; // Izmenjeno
  private isAuthenticated = false;

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    this.isAuthenticated = isAuthenticated === 'true';
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  }

  async register(email: string, name: string, surname: string, password: string): Promise<boolean> {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      // Možete dodati dodatne informacije o korisniku u Firestore ako je potrebno
      return true;
    } catch (error) {
      console.error('Registration error', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
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
