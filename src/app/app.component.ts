import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
    if (isLoggedIn) {
      this.authService.autoLogin();
    }

    const currentUrl = localStorage.getItem('currentUrl');
    if (currentUrl) {
      this.router.navigate([currentUrl]);
    }

    this.router.events.subscribe(() => {
      localStorage.setItem('currentUrl', this.router.url);
    });
  }
}
