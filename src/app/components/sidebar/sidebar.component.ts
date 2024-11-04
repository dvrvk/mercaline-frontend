import { Component, OnInit } from '@angular/core';
import { Categories, ProductService, Status } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports : [CommonModule, CapitalizeFirstPipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  categories : Categories[] = [];
  status : Status[] = [];
  selectedCategory: number | null = null;
  selectedStatuses: number[] = [];

  constructor(private productService : ProductService) { }

  ngOnInit() {
    //this.loadCategories();
    //this.loadStatus();
  }

  // loadCategories() : void {
  //   // Posibilidad de guardarlas en indexdb

  //   this.productService.getCategories().subscribe(
  //     (data: Categories[]) => {
  //       this.categories = data;
  //     }, 
  //     (error) => {
  //       // Error al cargar las categorias
  //     }
  //   );
  // }

  loadStatus() {
    this.productService.getStatus().subscribe(
      (data: Status[]) => {
        this.status = data;
      }, 
      (error) => {
        // Error al cargar las categorias
      }
    );
  }

  onCategoryChange(categoryId:number) {
    this.selectedCategory = categoryId;
  }

  onStatusChange(statusId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedStatuses.push(statusId);
    } else {
      const index = this.selectedStatuses.indexOf(statusId);
      if (index > -1) {
        this.selectedStatuses.splice(index, 1);
      }
    }
    console.log(this.selectedStatuses)
  }

}
