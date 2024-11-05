import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { ErrorMessagesComponent } from '../validation/error-messages/error-messages.component';
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { SuccessAlertComponent } from '../alerts/success-alert/success-alert.component';

//declare var Swal: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule, 
    ErrorMessagesComponent, ErrorAlertComponent, SuccessAlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
guardarPerfil() {
throw new Error('Method not implemented.');
}
eliminarPerfil() {
throw new Error('Method not implemented.');
}

  userLogin: FormGroup;
  user: any;

  isError : boolean = false;
  titleError : string = '';
  errorMessage : string = '';

  isSuccess : boolean = false;
  successTitle : string = '';

  constructor(
    private userService : UserServiceService,
    private router : Router,
    private fb: FormBuilder
  ) {
    this.userLogin = this.fb.group({
      username : ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9]*$')]],
      password : ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.maxLength(50)]]
    })

  }

  iniciarSesion() {
    if(this.userLogin.valid) {
      // Formateo los datos
      this.userService.formatUserDataLogin(this.userLogin.value);
      // Petición POST
      this.userService.logIn(this.userLogin.value).subscribe({
        next: (response) => {
          // Notificación usuario logeado
          this.isSuccess = true;
          this.successTitle = 'Sesión iniciada correctamente'
          // Login - redirigimos a su home
          setTimeout(()=> {
            this.router.navigate(["/home"]);
          }, 500)
          
        },
        error: (error) => {
          // Mensaje de error
          this.isError = true;
          this.titleError = "Error al iniciar sesión";
          this.errorMessage = error.error.mensaje;
        }
      })
    } else {
      // Mensajes de validacion
      this.userLogin.markAllAsTouched();
    }
    
  }

  onConfirmation(confirmed: boolean) {
    if(confirmed === false) {
      this.isError = false;
    }
  }
}
