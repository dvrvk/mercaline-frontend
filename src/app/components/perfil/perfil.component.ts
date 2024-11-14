import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { SvgProfileComponent } from '../svg-icons/svg-profile/svg-profile.component';
import { SuccessAlertComponent } from '../alerts/success-alert/success-alert.component';
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { DeleteUserComponent } from "../delete-user/delete-user.component";
import { EditUserComponent } from "../edit-user/edit-user.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,
    NavbarComponent,
    SvgProfileComponent,
    SuccessAlertComponent,
    ErrorAlertComponent,
    ChangePasswordComponent, 
    DeleteUserComponent, 
    EditUserComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  
  userData: any = '';
  email : string = ''
  private userDataSubscription: Subscription | null = null;

  isError : boolean = false;
  titleError : string = '';
  errorMessage : string = '';

  isSuccess : boolean = false;
  successTitle : string = ''

  constructor(
    private userService: UserServiceService
    ) { }

  ngOnInit(): void {
    this.userDataSubscription = this.userService.userData$.subscribe(
      data => {
        this.userData = data || {}; // Actualiza el campo en el nav
        const userDataString = localStorage.getItem('userdata');
        this.email = userDataString ? JSON.parse(userDataString).email : '';
        setTimeout(() => {
        // Forzar a Angular a re-renderizar el componente después de la actualización de los datos
        }, 0);
      }
    );
  }

  onConfirmation(confirmed: boolean) {
    if(confirmed === false) {
      this.isError = false;
    }
  }
    
    
}
