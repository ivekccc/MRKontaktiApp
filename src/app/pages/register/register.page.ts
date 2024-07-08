import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

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

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private alertCtrl: AlertController) { }

  ngOnInit() {
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
}
