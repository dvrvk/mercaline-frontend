import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";
import { UserServiceService } from '../../services/user-service/user-service.service';
import { SvgProfileComponent } from '../svg-icons/svg-profile/svg-profile.component';
import { ErrorMessagesComponent } from '../validation/error-messages/error-messages.component';
import { SuccessAlertComponent } from '../alerts/success-alert/success-alert.component';
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { ChangePasswordComponent } from "../change-password/change-password.component";

declare var Swal: any;

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    NavbarComponent,
    FormsModule,
    SvgProfileComponent,
    ReactiveFormsModule,
    ErrorMessagesComponent,
    SuccessAlertComponent,
    ErrorAlertComponent, 
    ChangePasswordComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  user : FormGroup;
  userGet: any | null;

  isError : boolean = false;
  titleError : string = '';
  errorMessage : string = '';

  isSuccess : boolean = false;
  successTitle : string = ''

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
    });
    const userDataString = localStorage.getItem('userdata');
    this.userGet = userDataString ? JSON.parse(userDataString) : null;
  }

  // método para guardar cambios en perfil (botón Guardar Cambios)
  guardarPerfil(): void {
    
    if (this.user.valid) {
      this.userService.updateUsuario(this.user.value).subscribe(
        response => {
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
         
          // Actualizo campos de nav
          const userDataString = localStorage.getItem('userdata');
          this.userGet = userDataString ? JSON.parse(userDataString) : null;

        },
        error => {

          this.isError = true;
          this.titleError = 'Error al actualizar'
          this.errorMessage = (Object.values(error.error.mensaje)).join(' ');
        }
      );
    } else {
      this.user.markAllAsTouched();
    }
    
  }

  // método para eliminar el perfil de usuario
  eliminarPerfil(): void {
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
        this.userService.deleteUsuario().subscribe(
          response => {
            Swal.fire(
              '¡Eliminado!',
              'Tu perfil ha sido eliminado.',
              'success'
            );
            this.userService.logOut();
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Error al eliminar el perfil', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar tu perfil. Inténtalo de nuevo más tarde.',
              'error'
            );
          }
        );
      }
    })
  }

  onConfirmation(confirmed: boolean) {
    if(confirmed === false) {
      this.isError = false;
    }
  }
    
    
}
