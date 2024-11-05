import { Component } from '@angular/core';
import { FormsModule, Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorMessagesComponent } from '../validation/error-messages/error-messages.component';
import { UserServiceService } from '../../services/user-service/user-service.service';
import Swal from 'sweetalert2';
import { SvgSignupComponent } from "../svg-icons/svg-signup/svg-signup.component";
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { SuccessAlertComponent } from '../alerts/success-alert/success-alert.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, 
            RouterLink, 
            CommonModule, 
            ReactiveFormsModule, 
            ErrorMessagesComponent, 
            SvgSignupComponent,
            ErrorAlertComponent,
            SuccessAlertComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  userRegister: FormGroup;
  usernameExists = false;
  emailExists = false;

  isError : boolean = false;
  titleError : string = '';
  errorMessage : string = '';

  isSuccess : boolean = false;
  successTitle : string = '';

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

  onSubmit() {
    if (this.userRegister.valid) {
      this.userService.formatUserDataRegister(this.userRegister.value);
      this.userService.registrarUsuario(this.userRegister.value).subscribe({
        next: (response) => {
          
          // Mensaje exito
          this.isSuccess = true;
          this.successTitle = 'Usuario registrado correctamente'
          // Login - redirigimos a su home
          setTimeout(()=> {
            this.login();
          }, 1000)
          
        },
        error: (error) => {

          // Mensaje de error
          this.isError = true;
          this.titleError = "Ooops...";
          this.errorMessage = (Object.values(error.error.mensaje)).join(' ');

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

  onConfirmation(confirmed: boolean) {
    if(confirmed === false) {
      this.isError = false;
    }
  }
}
