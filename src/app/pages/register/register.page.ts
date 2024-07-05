import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
    surname: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
  }

  register() {
    if (this.registerForm.valid) {
      const { username, name, surname, password } = this.registerForm.value;
      if (this.authService.register(username, name, surname, password)) {
        this.router.navigate(['/login']);
        this.registerForm.reset();
      } else {
        alert('Username already exists');
        this.registerForm.reset();
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
