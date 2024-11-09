import { Component, Input, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  [x: string]: any;

  userData: any;
  private userDataSubscription: Subscription | null = null;

  username : string = '';

  constructor(private userServiceService: UserServiceService, private router:Router) { }

  ngOnInit() {
    this.userDataSubscription = this.userServiceService.userData$.subscribe(
      data => {
        this.userData = data; // Actualiza el campo en el nav
      }
    );
  }

  logOut(){
    this.userServiceService.logOut();
    this.router.navigate(['login']);
  }

}
