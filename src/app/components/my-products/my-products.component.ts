import { Component, OnInit } from '@angular/core';
import { ProductService, ProductResponseSummaryDTO, Page, FilterClass } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Router } from '@angular/router';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { SgvNotFoundComponent } from '../svg-icons/sgv-not-found/sgv-not-found.component';
import { FilterComponent } from '../filter/filter.component';
import { OrderByProductsComponent } from '../order-by-products/order-by-products.component';
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyFormatPipe,
    CapitalizeFirstPipe,
    SgvNotFoundComponent,
    FilterComponent,
    OrderByProductsComponent,
    ErrorAlertComponent,
    NavbarComponent],
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {

  products: ProductResponseSummaryDTO[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 12;
  selectedCategory: string = '';
  selectedCategoryId: number = 0;
  arefiltersApplied: boolean = false;
  filterApplied: FilterClass | null = null;
  orderApplied: string | null = null;
  isError: boolean = false;
  errorMessage: string = "Ups, lo sentimos no hemos podido conectarnos al servidor. Por favor, intentalo más tarde.";
  errorMessageAlert: string = '';
  errorTitleAlert: string = '';
  isErrorAlert: boolean = false;

  constructor(
    private productService: ProductService,
    private userService: UserServiceService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadUserProducts(this.currentPage, this.pageSize);
  }

  loadUserProducts(page: number, size: number): void {
    const userId = this.userService.getUserId();
    if (userId) {
      this.productService.getUserProducts(userId).subscribe(
        (data) => {
          this.products = data;
          this.totalElements = data.length; // Suponiendo que el total es el tamaño del array devuelto
          this.totalPages = Math.ceil(this.totalElements / this.pageSize);
          this.currentPage = page;
        },
        (error) => {
          console.error('Error al cargar los productos del usuario', error);
          this.onError("Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo", "Error al cargar los productos");
        }
      );
    } else {
      console.error('No se encontró el ID del usuario.');
    }
  }

  onFiltersApplied(filters: FilterClass): void {
    this.filterApplied = filters;
    this.loadUserProducts(0, this.pageSize);
  }

  onFilterChange(areFilter: boolean): void {
    this.arefiltersApplied = areFilter;
  }

  onOrderApplied(order: string): void {
    this.orderApplied = order;
    this.loadUserProducts(0, this.pageSize);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadUserProducts(page, this.pageSize);
    }
  }

  private onError(message: string, title: string): void {
    this.errorMessageAlert = message;
    this.errorTitleAlert = title;
    this.isErrorAlert = true;
    this.isError = true;
  }

  onConfirmationError(): void {
    this.isErrorAlert = false;
  }

  getImages(products: ProductResponseSummaryDTO[]): void {
    this.products.forEach((product) => {
      this.productService.getProductImage(product.id).subscribe(
        (imageBlob) => {
          if (imageBlob instanceof Blob) {
            if (imageBlob.type.startsWith('image/')) {
              const objectURL = URL.createObjectURL(imageBlob);
              product.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            } else {
              product.imageUrl = product.imageUrl;
            }
          }
        },
        (error) => {
          product.imageUrl = this.sanitizer.bypassSecurityTrustUrl('assets/images/not_found.png');
        }
      );
    });
  }
}
