import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

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
  isLoading: boolean = false;

  constructor(private authService: AuthService,
     private router: Router, private fb: FormBuilder, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  login() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (data) => {
          console.log("Login successful");
          localStorage.setItem('isAuthenticated', 'true');
          this.isLoading = false;
          this.router.navigate(['/contacts']);
        },
        errRes => {
          console.log(errRes);
          this.isLoading = false;
          let message = "Incorrect email or password";
          const errorMessage = errRes.error?.error?.message;
          switch (errorMessage) {
            case 'EMAIL_NOT_FOUND':
              message = 'User not found';
              break;
            case 'INVALID_PASSWORD':
              message = 'Incorrect password';
              break;
            case 'USER_DISABLED':
              message = 'User account is disabled';
              break;
            case 'INVALID_LOGIN_CREDENTIALS':
              message = 'Invalid login credentials';
              break;
            default:
              message = 'Login failed. Please try again.';
          }

          this.alertCtrl.create({
            header: 'Authentication failed',
            message: message,
            buttons: ['Okay']
          }).then(alertEl => alertEl.present());
        }
      );
      this.loginForm.reset();
    }
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }
}
