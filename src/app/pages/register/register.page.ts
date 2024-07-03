import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
username: string = '';
password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
register() {
  if (this.authService.register(this.username, this.password)) {
    this.router.navigate(['/login']);
  } else {
    alert('Username already exists');
  }
}
goToLogin() {
  this.router.navigate(['/login']);
}
}
