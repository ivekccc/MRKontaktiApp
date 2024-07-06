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

  login(){
    this.authService.login(this.loginForm.value).subscribe((data)=>{
      console.log("Login uspešan");
      localStorage.setItem('token',data.idToken);
      this.router.navigate(['/contacts']);
    })
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
