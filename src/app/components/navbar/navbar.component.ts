import { Component, Input, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { RouterOutlet } from '@angular/router';

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

  constructor() { }

  ngOnInit() {
  }

}
