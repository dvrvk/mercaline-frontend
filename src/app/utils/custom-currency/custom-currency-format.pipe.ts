import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrencyFormat',
  standalone: true
})
export class CustomCurrencyFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (value !== null && value !== undefined) {
      return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }
    return '';
  }
}
