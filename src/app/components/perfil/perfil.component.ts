import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var Swal: any;

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{
  userdata : any = "";

  constructor(private router: Router, private userService: UserServiceService) {};

  ngOnInit(): void {
    this.userData();
  }

  userData() {
    const userString = localStorage.getItem('userdata');
    if(userString) {
      console.log(JSON.parse(userString));
      this.userdata = JSON.parse(userString);
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error al cargar el perfil",
        text: "No se han podido cargar los datos del perfil, vuelve a iniciar sesión",
        showConfirmButton: true
      });

      this.userService.logOut();
      this.router.navigate(["/login"]);
      
    }
  }
  
}
