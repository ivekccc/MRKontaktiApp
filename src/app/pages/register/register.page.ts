import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit{
  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
    surname: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')]]
  });

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private alertCtrl: AlertController) { }

  ngOnInit() {
  }


  ngOnLeave(){
    this.registerForm.reset();
  }

  register(){
    this.authService.register(this.registerForm.value).subscribe((data)=>{
      console.log("Registracija uspešna");
      this.router.navigate(['/login']);
    }
    ,
    errRes=>{
      let errorMessage = errRes.error?.error?.message;
      if(errorMessage=='EMAIL_EXISTS'){
        errorMessage='Email already exists';
      }
      this.alertCtrl.create({
        header: 'Registration failed',
        message: errorMessage,
        buttons: ['Okay']
      }).then(alertEl=>alertEl.present());
    }
  )
  this.registerForm.reset();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  getPasswordErrorMessage() {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required.';
    } else if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 8 characters long.';
    } else if (passwordControl?.hasError('pattern')) {
      const value = passwordControl.value;
      if (!/[a-z]/.test(value)) {
        return 'Password must contain at least one lowercase letter.';
      } else if (!/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter.';
      } else if (!/[0-9]/.test(value)) {
        return 'Password must contain at least one number.';
      }
    }
    return '';
  }
}
