import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Categories, Page, ProductService } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { CategoryService } from '../../services/category/category.service';
import { ArrayType } from '@angular/compiler';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CapitalizeFirstPipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories : Categories[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 8;
  selectedCategory : Object = {};

  constructor(private productService : ProductService,
              private categoryService : CategoryService
  ) {}

  ngOnInit() {
    this.updateItemsPerPage();
  }

  selectCategory(category: any[]) {
    this.selectedCategory = category;
    this.categoryService.selectCategory(this.selectedCategory);
  }

  @HostListener('window:resize', ['$event'])
  updateItemsPerPage() {
    const width = window.innerWidth;

    // Define la lógica para ajustar itemsPerPage
    if (width < 576) { // xs
      this.pageSize = 2;
    } else if (width < 768) { // sm
      this.pageSize = 2;
    } else if (width < 992) { // md
      this.pageSize = 4;
    } else { // lg y mayores
      this.pageSize = 8;
    }

    this.loadCategories(0, this.pageSize);
  }

  loadCategories(page: number, size: number) : void {
    // Posibilidad de guardarlas en indexdb

    this.productService.getCategories(page, size).subscribe(
      (data: Page<Categories>) => {
        this.categories = data.content;
        this.totalElements = data.page.totalElements;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number;
      }, 
      (error) => {
        // Error al cargar las categorias
      }
    );
  }

  onPageChange(page: number): void {
    this.loadCategories(page, this.pageSize);
  }

}
