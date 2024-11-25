import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilterClass, ProductService, Status } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  // Filtro status
  statusList : Status[] = [];
  selectedStatus : number[] = []; // Array de id Status aplicados
  selectedTemporalStatus : number[] = []; // Array de id Status seleccionados sin aplicar
  areStatusFilterApplied : boolean = false; // Variable que comprueba si el estatus está aplicado
  alertStatus : number[] = []; // Variable para mostrar la alerta de cambios en estatus

  // Filtro precio
  minPrice: number | null = null;    // Valor aplicado para precio mínimo
  maxPrice: number | null = null; // Valor aplicado para precio máximo
  minTempPrice : number | null = null; // Valor seleccionado para precio mínimo sin aplicar
  maxTempPrice : number | null = null; // Valor seleccionado para precio máximo sin aplicar
  errorRange : boolean = false; // Variable para mostrar el error min > max

  // Objeto de filtro para el envio de datos
  filter: FilterClass = {
    statusFilter: [],
    maxPrice: 0,
    minPrice: 0,
  };

  // Variable para mostrar si se han aplicado filtros
  areFiltersApplied : boolean = false;

  // Outputs para emitir los valores de filtros aplciados y estatus de filtros a otros componentes
  @Output() filterApplied = new EventEmitter<FilterClass>();
  @Output() filterPriceApplied = new EventEmitter<number[]>()
  @Output() filterStatusChanged = new EventEmitter<boolean>();

  constructor(private productService : ProductService) {}

  ngOnInit() : void {
    this.loadStatus();
  }

  // Carga de la BD los estados de productos
  loadStatus() {
    this.productService.getStatus().subscribe(
      (datos) => {
        this.statusList = datos;
      }, 
      (error)=> {
        console.log(error);
      }
    )
  }

  // Guarda los estados seleccionados
  onCheckboxChange(event : Event) {
    const checkbox = event.target as HTMLInputElement;
    this.alertStatus = this.selectedTemporalStatus;
    if (checkbox.checked) {
      this.selectedTemporalStatus.push(Number.parseInt(checkbox.value));
    } else {
      const index = this.selectedTemporalStatus.indexOf(Number.parseInt(checkbox.value));
      if (index > -1) {
        this.selectedTemporalStatus.splice(index, 1);
      }
    }
  }

  // Boton para borrar los estados
  clearSelections() {
    this.selectedTemporalStatus = [];
    this.alertStatus = this.selectedTemporalStatus;
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
  }

  // Comprueba si se han aplicado filtros de precio
  areFilterPriceAppliedF() : boolean {
    return this.minPrice !== null || this.maxPrice !== null;
  }

  // POSIBLE ELIMINACION
  changePrice(event : Event) : void {
    this.areFiltersApplied =  this.areFilterPriceAppliedF()
    this.filterStatusChanged.emit(this.areFiltersApplied);
  }

  // Alerta status seleccionado
  areSelectedStatusF() : boolean {
    return this.alertStatus.length > 0;
  }

  clearPriceInputs() : void {
    const inputsPrice = document.querySelectorAll('input[type="number"]');
    inputsPrice.forEach(input => {
      (input as HTMLInputElement).value = '';
    })
  }

  // Boton borrar filtros
  clearFilter() : void {
    this.clearSelections();
    this.clearPriceInputs();
    // Limpio estado
    this.selectedStatus = [];
    this.filter.statusFilter = [];
    // Limpio precios
    this.maxTempPrice = null;
    this.minTempPrice = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.filter.minPrice = null;
    this.filter.maxPrice = null;

    this.areFiltersApplied = false;

    this.filterStatusChanged.emit(this.areFiltersApplied);
    this.filterApplied.emit(this.filter);
  }
  
  // Boton aplicar filtros
  applyFilters() {
    // Guardo los status definitivamente y los emito
    this.selectedStatus = Array.from(this.selectedTemporalStatus);
    this.filter.statusFilter = Array.from(this.selectedTemporalStatus);

    // Guardo los price y los emito
    this.minPrice = this.minTempPrice;
    this.maxPrice = this.maxTempPrice;
    this.filter.minPrice = this.minPrice;
    this.filter.maxPrice = this.maxPrice;

    // ¿Se aplico algun filtro?
    this.areFiltersApplied = this.selectedStatus.length > 0 || this.areFilterPriceAppliedF();

    // Emito si se ha aplicado algun filtro para poner la alerta en el boton filtro
    this.filterApplied.emit(this.filter);
    this.filterStatusChanged.emit(this.areFiltersApplied);

  }

  validarRango(): void {
    // Verificamos si ambos valores no son null y si el mínimo es mayor que el máximo
    if (this.minPrice !== null && this.maxPrice !== null) {
      this.errorRange = this.minPrice > this.maxPrice;
    } else {
      this.errorRange = false; // Si alguno es null, no hay error de rango
    }
  }

  closeModal(event : FocusEvent) {

    const relatedTarget = event.relatedTarget as HTMLElement;
    if(event.relatedTarget == null || relatedTarget.id == 'close-modal-btn') {
        //Evito que se borren los datos del value de price
        (document.getElementById('precioMin') as HTMLInputElement).value = this.minPrice?.toString() ?? '';
        (document.getElementById('precioMax') as HTMLInputElement).value = this.maxPrice?.toString() ?? '';
        
        this.clearSelections()
        
        this.selectedStatus.forEach(statusId => {
        (document.getElementById(`status-${statusId}`) as HTMLInputElement).checked = true;
      })
    }
    
  }

  openModal(event : FocusEvent) {

    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && (relatedTarget.tagName !== 'INPUT' && relatedTarget.id !== "dropdownMenuButton")) {
      this.alertStatus = this.selectedStatus;
    } 
    
  }
  
}
