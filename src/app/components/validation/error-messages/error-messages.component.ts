import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-messages',
  template: `
    <div *ngIf="control?.touched && control?.invalid" class="text-danger">
      <div *ngIf="control?.hasError('required')">Este campo es obligatorio.</div>
      <div *ngIf="control?.hasError('minlength')">Debe tener al menos {{ control?.errors?.['minlength']?.requiredLength }} caracteres.</div>
      <div *ngIf="control?.hasError('maxlength')">Debe tener como máximo {{ control?.errors?.['maxlength']?.requiredLength }} caracteres.</div>
      <div *ngIf="control?.hasError('pattern')">{{ getErrorMessage('pattern') || 'Formato inválido.' }}</div>
      <!-- <div *ngIf="control?.hasError('pattern')">Solo puede contener letras y números sin espacios.</div> -->
      <div *ngIf="control?.hasError('email')">Introduce un correo electrónico válido.</div>
      
    </div>
  `,
  styleUrls: ['./error-messages.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ErrorMessagesComponent {
  @Input() control: AbstractControl | null = null;
  @Input() errorMessage: {[ key: string] : string} | null = null;

  getErrorMessage(errorType: string): string {
    if (typeof this.errorMessage === 'string') {
      return this.errorMessage;
    }
    return this.errorMessage?.[errorType] || 'Error desconocido';
  }
}
