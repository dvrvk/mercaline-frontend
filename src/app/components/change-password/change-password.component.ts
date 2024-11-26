import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from '../validation/error-messages/error-messages.component';
import { matchPasswords } from '../validation/match-passwords/match-passwords.component';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { SuccessAlertComponent } from "../alerts/success-alert/success-alert.component";
import { ErrorAlertComponent } from "../alerts/error-alert/error-alert.component";
import { SpinnerLoadComponent } from "../../utils/spinner-load/spinner-load.component";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorMessagesComponent,
    SuccessAlertComponent,
    ErrorAlertComponent,
    SpinnerLoadComponent
],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordData : FormGroup;

  showPassword: boolean = false;
  showNewPassword: boolean = false;
  showRepeatPassword : boolean = false;

  isSuccess : boolean = false;
  successTitle : string = '';

  isError : boolean = false;
  titleError : string = '';
  errorMessage : string = '';

  isSubmiting : boolean = false;

  constructor(private fb: FormBuilder,
    private userService : UserServiceService
  ) {
    this.passwordData = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)]],
      newPassword2: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ]]
    }, 
    {
      validators: matchPasswords('newPassword', 'newPassword2')
    }
  );
  }

  changePassword() : void {
    if(this.passwordData.valid) {
      this.isSubmiting = true;
      this.userService.changePassword(this.passwordData.value).subscribe({
        next: (response) => {
          this.isSubmiting = false;
          // Mensaje exito
          this.isSuccess = true;
          this.successTitle = response.mensaje;

          // Resetear el formulario tras el éxito
          this.passwordData.reset();

          setTimeout(() => {
            this.isSuccess = false;
          }, 1000);
          
        },
        error: (error) => {
          this.isSubmiting = false;
          // Mensaje de error
          this.isError = true;
          this.titleError = "Ooops...";
          this.errorMessage = typeof error.error.mensaje === 'string' ? 
            error.error.mensaje : 
            (Object.values(error.error.mensaje)).join(' ');

          // Resetear el formulario tras error
          this.passwordData.reset();

        }
      });
    } else {
      this.passwordData.markAllAsTouched();
    }
  }

  togglePasswordVisibility(event : any): void {
    const btnId = (event.currentTarget as HTMLElement).id;
    switch(btnId) {
      case 'v-pass':
        this.showPassword = !this.showPassword;
        break;
      case 'v-newPass':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'v-repPass':
        this.showRepeatPassword = !this.showRepeatPassword;
        break;
      default:
          console.warn('ID de botón no reconocido:', btnId);
    }
    
  }

  onConfirmation(confirmed: boolean) {
    if(confirmed === false) {
      this.isError = false;
    }
  }
}
