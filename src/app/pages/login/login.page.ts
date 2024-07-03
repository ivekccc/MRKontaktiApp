import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/contacts']);
    } else {
      alert('Invalid username or password');
    }
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
