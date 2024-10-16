import { Component } from '@angular/core';
import { FormsModule, Validators, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorMessagesComponent } from '../validation/error-messages/error-messages.component';
import { UserServiceService } from '../../services/user-service/user-service.service';

declare var Swal: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  userRegister: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router,

  ) { 
    this.userRegister = this.fb.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9]*$')]],
      name: ['', [
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$'), 
        Validators.maxLength(50),
        Validators.minLength(2)]],
      lastname: ['', [
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$'), 
        Validators.maxLength(50),
        Validators.minLength(2)]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.maxLength(50)]],
      tel: ['', [
        Validators.pattern('^(\\+34|0034|34)?[6-7][0-9]{8}$')]]
    });

  }

  onSubmit() {
    if(this.userRegister.valid) {
      // Formateo los datos
      this.userService.formatUserDataRegister(this.userRegister.value);
      // Petición POST al servidor
      this.userService.registrarUsuario(this.userRegister.value).subscribe({
        next : (response) => {
          // Notificación usuario registrado
          Swal.fire({
            position: "center",
            icon: "success",
            title: `${response.username} se ha registrado`,
            showConfirmButton: false,
            timer: 1500
          });
          // Login - redirigimos a su home
          this.login();
        },
        error : (error) => {
          // Mensaje de error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: (Object.values(error.error.mensaje)).join(' ')
          });
      }})
    } else {
      // Mensajes de validacion
      this.userRegister.markAllAsTouched();
    }
  }

  login() {
    this.userService.logIn(this.userRegister.value).subscribe(
      response => {
        this.router.navigate(["/home"]);
      },
      error => {
        console.log(error)
      }
    )
  }
}
