import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService, Status } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {

  statusList : Status[] = [];
  selectedStatus : number[] = [];
  areFiltersApplied : boolean = false;

  @Output() filtersApplied = new EventEmitter<number[]>();
  @Output() filterStatusChanged = new EventEmitter<boolean>();

  constructor(private productService : ProductService) {}

  ngOnInit() : void {
    this.loadStatus();
  }


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

  onCheckboxChange(event : Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedStatus.push(Number.parseInt(checkbox.value));
    } else {
      const index = this.selectedStatus.indexOf(Number.parseInt(checkbox.value));
      if (index > -1) {
        this.selectedStatus.splice(index, 1);
      }
    }
    this.areFiltersApplied = this.selectedStatus.length > 0;
    this.filterStatusChanged.emit(this.areFiltersApplied);

  }

  clearSelections() {
    this.selectedStatus = [];
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
    this.areFiltersApplied = false;
    this.filterStatusChanged.emit(this.areFiltersApplied);
  }

  applyFilters() {
    this.filtersApplied.emit(this.selectedStatus);
  }
  
}
