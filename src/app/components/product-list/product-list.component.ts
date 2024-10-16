import { Component, OnInit } from '@angular/core';
import { ProductService, ProductResponseSummaryDTO, Page } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';

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

  constructor(private productService: ProductService) {}

  ngOnInit() : void {
    this.loadProducts(this.currentPage, this.pageSize);
  }

  loadProducts(page: number, size: number) : void {
    this.productService.getProduct(page, size).subscribe(
      (data: Page<ProductResponseSummaryDTO>) => {
        console.log(data)
        this.products = data.content;
        this.totalElements = data.page.totalElements;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number;
      }, 
      (error) => {
        console.error('Error al cargar los productos', error)
      }
    );
  }

  onPageChange(page: number): void {
    this.loadProducts(page, this.pageSize);
  }

}


