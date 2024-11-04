import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { ErrorMessagesComponent } from '../validation/error-messages/error-messages.component';

declare var Swal: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userLogin: FormGroup;

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
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Inicio de sesión exitoso",
            showConfirmButton: false,
            timer: 1500
          })
          // Login - redirigimos a su home
          this.router.navigate(["/home"]);
        },
        error: (error) => {
          // Mensaje de error
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al iniciar sesión",
            text: error.error.mensaje,
            showConfirmButton: true
          });
        }
      })
    } else {
      // Mensajes de validacion
      this.userLogin.markAllAsTouched();
    }

    
  }
}
