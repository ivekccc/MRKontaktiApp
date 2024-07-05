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
  registerForm: FormGroup= this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
  }
register() {
  if (this.registerForm.valid) {
    const { username, password } = this.registerForm.value;
    if (this.authService.register(username, password)) {
      this.router.navigate(['/login']);
    } else {
      alert('Username already exists');
    }
  }
}
goToLogin() {
  this.router.navigate(['/login']);
}
}
