import { Component } from '@angular/core';
import { ErrorMessagesComponent } from "../validation/error-messages/error-messages.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SuccessAlertComponent } from "../alerts/success-alert/success-alert.component";
import { ErrorAlertComponent } from "../alerts/error-alert/error-alert.component";
import { SpinnerLoadNotblockComponent } from "../../utils/spinner-load-notblock/spinner-load-notblock.component";
import { SpinnerLoadComponent } from "../../utils/spinner-load/spinner-load.component";

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    ErrorMessagesComponent,
    CommonModule,
    ReactiveFormsModule,
    SuccessAlertComponent,
    ErrorAlertComponent,
    SpinnerLoadNotblockComponent,
    SpinnerLoadComponent
],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  user : FormGroup;

  isError : boolean = false;
  titleError : string = '';
  errorMessage : string = '';

  isSuccess : boolean = false;
  successTitle : string = ''

  isLoading : boolean = true;
  isSubmiting : boolean = false;

  constructor(
    private userService: UserServiceService, 
    private router: Router,
    private fb: FormBuilder
    ) { 
    this.user = this.fb.group({
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
      tel: ['', [
        Validators.pattern('^(\\+34|0034|34)?[6-7][0-9]{8}$')]]
    });
  }

  ngOnInit(): void {
    this.userService.getUsuario().subscribe(datos => {
      this.user.patchValue(datos);
      this.isLoading = false;
    },
    error => {
      this.isLoading = false;
      this.isError = true;
      this.titleError = 'Ooops...'
      this.errorMessage = typeof error.error.mensaje === 'string' ? 
      error.error.mensaje : 
      (Object.values(error.error.mensaje)).join(' ');

      
    });
  }

  // método para guardar cambios en perfil (botón Guardar Cambios)
  guardarPerfil(): void {
    
    if (this.user.valid) {
      this.isSubmiting = true;
      this.userService.updateUsuario(this.user.value).subscribe(
        response => {
          this.isSubmiting = false;
          // Mensaje de exito
          this.isSuccess = true;
          this.successTitle = "Perfil actualizado con exito";
          
          
          // Actualizo local storage
          localStorage.setItem('userdata', JSON.stringify({
            username: response.username,
            email: response.email,
            tel: response.tel
          }));
          this.userService.updateUserData({'username' : response.username, 'email': response.email, 'tel': response.tel})

          setTimeout(() => {
            this.isSuccess = false;
          }, 1000);
        },
        error => {
          this.isSubmiting = false;
          this.isError = true;
          this.titleError = 'Error al actualizar'
          this.errorMessage = (Object.values(error.error.mensaje)).join(' ');
        }
      );
    } else {
      this.user.markAllAsTouched();
    }
    
  }

  onConfirmation(confirmed: boolean) {
    if(confirmed === false) {
      this.isError = false;
    }
  }

}
