import { Component, Input, OnInit } from '@angular/core';
import { ProductService, ProductResponseSummaryDTO, Page } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Router } from '@angular/router';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { CategoryService } from '../../services/category/category.service';
import { SgvNotFoundComponent } from "../svg-icons/sgv-not-found/sgv-not-found.component";
import { FilterComponent } from "../filter/filter.component";

declare var Swal: any;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CustomCurrencyFormatPipe, CapitalizeFirstPipe, SgvNotFoundComponent, FilterComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: ProductResponseSummaryDTO[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 12;

  selectedCategory: string = '';
  selectedCategoryId: number = 0;

  arefiltersApplied: boolean = false;

  constructor(
    private productService: ProductService, 
    private UserService: UserServiceService,
    private router: Router,
    private categoryService: CategoryService) {}

  ngOnInit() : void {
    this.loadProducts(this.currentPage, this.pageSize);
    this.categoryService.selectedCategory$.subscribe((category : any) => {
      if(Object.keys(category).length != 0) {
        this.selectedCategory = category[1];
        this.selectedCategoryId = category[0];
        this.loadProductsByCategory(this.currentPage, this.pageSize, category[0]);
      }
     
      // Aquí puedes cargar los productos basados en la categoría seleccionada
    });
  }

  ngOnChanges(): void {
    this.loadProducts(this.currentPage, this.pageSize);
  }

  onFiltersApplied(selectedStatus: number[]) {
    this.productService.getProductsFilter(0, this.pageSize, this.selectedCategoryId, selectedStatus)
    .subscribe((data)=> {
      this.products = data.content;
      this.totalElements = data.page.totalElements;
      this.totalPages = data.page.totalPages;
      this.currentPage = data.page.number;
    },
    (error)=> {
      console.log(error)
    })
    // Aquí puedes ejecutar la función que necesites con los filtros aplicados
  }

  onFilterChange(areFilter: boolean) {
    this.arefiltersApplied = areFilter;
  }

  loadProductsByCategory(page: number, size: number, categoryId:number ) : void {

    this.productService.getProductsByCategory(page, size, categoryId).subscribe(
      (data: Page<ProductResponseSummaryDTO>) => {
        
        this.products = data.content;
        this.totalElements = data.page.totalElements;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number;
      }, 
      (error) => {
        console.error('Error al cargar los productos', error.error)

        const message = error.error && error.error.message ? error.error.message : "Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo"

        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error al cargar los productos",
          text: message,
          showConfirmButton: true
        });

        // Si el token no es valido se hace logout()
        if(Number(error.error.status) === 401) {
          this.UserService.logOut();
          this.router.navigate(["/login"]);
          
        }
      }
    );
 
  }
  

  loadProducts(page: number, size: number) : void {

      this.productService.getProduct(page, size).subscribe(
        (data: Page<ProductResponseSummaryDTO>) => {
          
          this.products = data.content;
          this.totalElements = data.page.totalElements;
          this.totalPages = data.page.totalPages;
          this.currentPage = data.page.number;
        }, 
        (error) => {
          console.error('Error al cargar los productos', error.error)
  
          const message = error.error && error.error.message ? error.error.message : "Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo"
  
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al cargar los productos",
            text: message,
            showConfirmButton: true
          });
  
          // Si el token no es valido se hace logout()
          if(Number(error.error.status) === 401) {
            this.UserService.logOut();
            this.router.navigate(["/login"]);
            
          }
        }
      );
   
    }

    onPageChange(page: number): void {
      this.loadProducts(page, this.pageSize);
    }
    
}





