import { Component, Input, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { Router, RouterOutlet } from '@angular/router';
import { UserServiceService } from '../../services/user-service/user-service.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [HomeComponent, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  [x: string]: any;

  @Input()
  usuario: string | undefined;

  constructor(private UserServiceService:UserServiceService, private router:Router) { }

  ngOnInit() {
  }

  logOut(){
    this.UserServiceService.logOut();
    this.router.navigate(['login']);
  }

}
