import { Component } from '@angular/core';
import { SuccessAlertComponent } from "../alerts/success-alert/success-alert.component";
import { ErrorAlertComponent } from "../alerts/error-alert/error-alert.component";
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Router } from '@angular/router';
import { ErrorMessagesComponent } from "../validation/error-messages/error-messages.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var Swal: any;

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SuccessAlertComponent,
    ErrorAlertComponent,
    ErrorMessagesComponent
  ],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css'
})
export class DeleteUserComponent {

  passwordData: FormGroup;

  showPassword: boolean = false;
  isSuccess: boolean = false;
  successTitle: string = '';

  isError: boolean = false;
  titleError: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.passwordData = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)]]
    })
  }

  // método para eliminar el perfil de usuario
  eliminarPerfil(): void {
    if (this.passwordData.valid) {
      Swal.fire({
        title: '¿Estás seguro de eliminar tu perfil?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#48be79',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
      }).then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed) {

          this.userService.deleteUsuario(this.passwordData.get('password')?.value).subscribe(
            response => {
              Swal.fire({
                title: '¡Eliminado!',
                text: 'Tu perfil ha sido eliminado.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#48be79'
            });
              this.userService.logOut();
              this.router.navigate(['/login']);
            },
            error => {
              console.error('Error al eliminar el perfil', error);
              Swal.fire(
                'Error',
                error.error?.mensaje || 'Hubo un problema al eliminar tu perfil. Inténtalo de nuevo más tarde.',
                'error'
              );
            }
          );
        }
      })

    } else {
      this.passwordData.markAllAsTouched();
    }
  }

  togglePasswordVisibility(event: any): void {
    this.showPassword = !this.showPassword;
  }

  onConfirmation(confirmed: boolean) {
    if (confirmed === false) {
      this.isError = false;
    }
  }
}
