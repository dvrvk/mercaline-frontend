import { Component } from '@angular/core';
import { FormsModule, Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorMessagesComponent } from '../validation/error-messages/error-messages.component';
import { UserServiceService } from '../../services/user-service/user-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  userRegister: FormGroup;
  usernameExists = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
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

  checkUsername() {
    const username = this.userRegister.get('username')?.value;
    if (username) {
      this.userService.checkUsername(username).subscribe({
        next: (response) => {
          if (response.exists) {
            this.usernameExists = true;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El nombre de usuario ya está registrado. Por favor, elige otro.'
            });
          } else {
            this.usernameExists = false;
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al comprobar el usuario',
            text: 'Ha ocurrido un error al verificar si el usuario ya está registrado. Inténtalo de nuevo.'
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.userRegister.valid && !this.usernameExists) {
      this.userService.formatUserDataRegister(this.userRegister.value);
      this.userService.registrarUsuario(this.userRegister.value).subscribe({
        next: (response) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `${response.username} se ha registrado`,
            showConfirmButton: false,
            timer: 1500
          });
          this.login();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: (Object.values(error.error.mensaje)).join(' ')
          });
        }
      });
    } else {
      this.userRegister.markAllAsTouched();
    }
  }

  login() {
    this.userService.logIn(this.userRegister.value).subscribe(
      response => {
        this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
      }
    );
  }
}
