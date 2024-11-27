import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner-load-notblock',
  standalone: true,
  imports: [],
  template: `
  <div class="spinner-overlay">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <span class="loader"></span>
      <h3>Cargando...</h3>
    </div>
  </div>
  `,
  styleUrl: './spinner-load-notblock.component.css'
})
export class SpinnerLoadNotblockComponent {

}
