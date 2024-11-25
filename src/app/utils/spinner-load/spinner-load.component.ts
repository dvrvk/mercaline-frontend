import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-load',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="spinner-overlay" *ngIf="isLoading">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <span class="loader"></span>
      <h3>Cargando...</h3>
    </div>
  </div>
  `,
  styleUrl: './spinner-load.component.css'
})
export class SpinnerLoadComponent {
  @Input() isLoading : boolean = false;
}
