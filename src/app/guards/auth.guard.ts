import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
