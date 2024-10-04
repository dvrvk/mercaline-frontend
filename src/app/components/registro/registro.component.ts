import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

declare var Swal: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  user = {
    username: '',
    email: '',
    password: '',
    tel: ''
  };

  constructor(
    private userService: UserServiceService,
    private router: Router

  ) { }

  onSubmit() {
    this.userService.registrarUsuario(this.user).subscribe({
      next: (response) => {
        
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${response.username} se ha registrado`,
          showConfirmButton: false,
          timer: 1500
        });

        this.login();
        
      },
      error: (error) => {
        console.error('Error al registrar el usuario:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se ha podido registrar al usuario",
        });
      }
    });
  }

  login() {
    this.userService.logIn(this.user).subscribe(
      response => {
        this.router.navigate(["/perfil"]);
      },
      error => {
        console.log(error)
      }
    )
  }
}
