import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var Swal: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    username : '',
    password : ''
  };

  constructor(
    private userService : UserServiceService,
    private router : Router
  ) {}

  iniciarSesion() {
    this.userService.logIn(this.user).subscribe({
      next: (response) => {

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Inicio de sesión exitoso",
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(["/perfil"]);
      },
      error: (error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error al iniciar sesión",
          text: error.error.mensaje,
          showConfirmButton: true
        });
      }
    })
  }
}
