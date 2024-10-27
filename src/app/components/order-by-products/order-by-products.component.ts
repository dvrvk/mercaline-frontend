import { Component, EventEmitter, Output } from '@angular/core';

declare var Swal: any;

@Component({
  selector: 'app-order-by-products',
  standalone: true,
  imports: [],
  templateUrl: './order-by-products.component.html',
  styleUrl: './order-by-products.component.css'
})

export class OrderByProductsComponent {
  sortBy: string = 'defecto';
  sortByOptions :  string[] = ['lowPrice', 'highPrice', 'default', ''];
  sortByOptionText : string[] = ['más baratos', 'más caros', 'defecto', ''];
  sortByBD : string[] = ['price,asc', 'price,desc', '', ''];

  @Output() orderApplied = new EventEmitter<string>();

  changeSort(newSort: string): void {
    if(this.sortByOptions.includes(newSort)) {
      this.sortBy = this.sortByOptionText[this.sortByOptions.indexOf(newSort)];
      console.log(this.sortByBD[this.sortByOptions.indexOf(newSort)])
      this.orderApplied.emit(this.sortByBD[this.sortByOptions.indexOf(newSort)]);
    } else {
      
      this.sortBy = 'defecto';
      // Mensaje de error
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ups, se ha producido un error",
        text: "Selecciona una opción valida para ordenar los resultados.",
        showConfirmButton: true
      });
    }
  }
}
