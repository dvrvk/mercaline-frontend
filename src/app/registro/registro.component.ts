import { Component } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var Swal: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
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
        //console.log('Usuario registrado:', response);
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${response.name} se ha registrado`,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (error) => {
        console.error('Error al registrar el usuario:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se ha podido registrar al usuario",
        });
      },
      complete: () => {
        this.router.navigate(["/"]);
        // Aquí puedes manejar cualquier acción adicional después de completar la solicitud
      }
    });
  }
}
