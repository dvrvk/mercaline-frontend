import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentYear : number = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }

}
