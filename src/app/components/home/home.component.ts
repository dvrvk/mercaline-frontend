import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductListComponent } from '../product-list/product-list.component';

declare var Swal: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ProductListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
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
