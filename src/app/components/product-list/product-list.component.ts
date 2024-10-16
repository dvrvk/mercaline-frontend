import { Component, OnInit } from '@angular/core';
import { ProductService, ProductResponseSummaryDTO, Page } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Router } from '@angular/router';

declare var Swal: any;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CustomCurrencyFormatPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: ProductResponseSummaryDTO[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  constructor(
    private productService: ProductService, 
    private UserService: UserServiceService,
    private router: Router) {}

  ngOnInit() : void {
    this.loadProducts(this.currentPage, this.pageSize);
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


