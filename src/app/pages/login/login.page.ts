import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private authService: AuthService,
     private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
  }

  async login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (await this.authService.login(email, password)) {
        this.router.navigate(['/contacts']);
        this.loginForm.reset();
      } else {
        alert('Invalid username or password');
        this.loginForm.reset();
      }
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
