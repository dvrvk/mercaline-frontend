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

  constructor(private userService: UserServiceService) { }

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
  
    
    
}
