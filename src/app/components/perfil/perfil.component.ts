import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";
import { UserServiceService } from '../../services/user-service/user-service.service';

declare var Swal: any;

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, RouterOutlet, FooterComponent, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  user: any = {

    username: '',
    name: '',
    lastname: '',
    email: '',
    tel:'',
    password: ''
  };

  constructor(private userService: UserServiceService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUsuario().subscribe(datos => {
      this.user = datos;
    });
  }

  // método para guardar cambios en perfil (botón Guardar Cambios)
  guardarPerfil(): void {
    console.log('Datos que se van a enviar:', this.user);// console.log de prueba
    this.userService.updateUsuario(this.user).subscribe(
      response => {
        console.log('Perfil actualizado con éxito', response);
      },
      error => {
        console.error('Error al actualizar el perfil', error);
      }
    );
  }

  // método para eliminar el perfil de usuario
  eliminarPerfil(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
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
  
    
    
}
