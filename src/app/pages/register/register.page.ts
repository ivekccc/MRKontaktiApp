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
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
    surname: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
  }

register(){
  this.authService.register(this.registerForm.value).subscribe((data)=>{
    console.log("Registracija uspešna");
  })
  this.router.navigate(['/login']);
}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
