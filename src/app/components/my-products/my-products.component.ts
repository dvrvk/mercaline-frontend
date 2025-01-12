import { Component, OnInit } from '@angular/core';
import {ProductService, ProductResponseSummaryDTO,Page,FilterClass,} from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { Router, RouterModule } from '@angular/router';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { SgvNotFoundComponent } from '../svg-icons/sgv-not-found/sgv-not-found.component';
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NavbarComponent } from '../navbar/navbar.component';
import { SpinnerLoadComponent } from "../../utils/spinner-load/spinner-load.component";
import { SpinnerLoadNotblockComponent } from "../../utils/spinner-load-notblock/spinner-load-notblock.component";

declare var Swal: any;

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyFormatPipe,
    CapitalizeFirstPipe,
    SgvNotFoundComponent,
    ErrorAlertComponent,
    NavbarComponent,
    RouterModule,
    SpinnerLoadNotblockComponent
],
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css'],
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
  errorMessage: string =
    'Ups, lo sentimos no hemos podido conectarnos al servidor. Por favor, intentalo más tarde.';
  errorMessageAlert: string = '';
  errorTitleAlert: string = '';
  isErrorAlert: boolean = false;

  isLoading : boolean = true;

  constructor(
    private productService: ProductService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadUserProducts(this.currentPage, this.pageSize);
  }

  loadUserProducts(page: number, size: number): void {
      this.productService.getUserProducts(page, size).subscribe(
        (data) => {
          console.log('Productos del usuario cargados', data);
          this.products = data.content;
          this.totalElements = data.page.totalElements;
          this.totalPages = data.page.totalPages;
          this.currentPage = data.page.number;
          this.isError = false;
          this.isLoading = false;
          this.getImages()
        },
        (error) => {
          console.error('Error al cargar los productos del usuario', error);
          this.onError(
            'Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo',
            'Error al cargar los productos'
          );
          this.isError = true;
          this.isLoading = false;
        }
      );
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadUserProducts(page, this.pageSize);
    }
  }

  onViewProduct(productId: number): void {
    this.router.navigate(['/actualizar-producto', productId], {
      queryParams: {
        page: this.currentPage,
        category: this.selectedCategoryId,
      },
    });
  }

  onDeleteProduct(productId: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar el producto?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#48be79',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(
          response => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'Tu producto ha sido eliminado.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#48be79'
          });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          error => {
            console.error('Error al eliminar el producto', error);
            Swal.fire(
              'Error',
              error.error?.mensaje || 'Hubo un problema al eliminar tu producto. Inténtalo de nuevo más tarde.',
              'error'
            );
          }
        );
      }
    })
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

  getImages(): void {
    this.products.forEach((product) => {
      this.productService.getProductImage(product.id).subscribe(
        (imageBlob) => {
          if (imageBlob instanceof Blob) {
            if (imageBlob.type.startsWith('image/')) {
              const objectURL = URL.createObjectURL(imageBlob);
              product.imageUrl =
                this.sanitizer.bypassSecurityTrustUrl(objectURL);
            } else {
              product.imageUrl = product.imageUrl;
            }
          }
        },
        (error) => {
          product.imageUrl = this.sanitizer.bypassSecurityTrustUrl(
            'assets/images/not_found.png'
          );
        }
      );
    });
  }
  
  markAsSold(productId: number): void { 
    Swal.fire({ 
      title: '¿Has vendido este producto?', 
      text: "¡Este cambio no se puede deshacer!", 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#48be79', 
      confirmButtonText: 'Sí, marcar como vendido', 
      cancelButtonText: 'Cancelar' 
    }).then((result: { isConfirmed: any; }) => 
      { if (result.isConfirmed) { 
        this.productService.markProductAsSold(productId).subscribe( response => { 
          Swal.fire({ 
            title: '¡Marcado como vendido!', 
            text: 'Tu producto ha sido marcado como vendido.', 
            icon: 'success', 
            confirmButtonText: 'Ok', 
            confirmButtonColor: '#48be79' 
          }); 
          setTimeout(() => {
            window.location.reload(); 
          }, 1000); 
        }, 
        error => { 
          console.error('Error al marcar el producto como vendido', error); 
          Swal.fire( 
            'Error', error.error?.mensaje || 'Hubo un problema al marcar tu producto como vendido. Inténtalo de nuevo más tarde.', 'error' ); 
          } ); 
        } }); 
      }

      markAsAvailable(productId: number): void {
        Swal.fire({
          title: '¿Quieres hacer disponible este producto nuevamente?',
          text: "¡Podrás volver a venderlo!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#48be79',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, hacerlo disponible',
          cancelButtonText: 'Cancelar'
        }).then((result: { isConfirmed: any; }) => {
          if (result.isConfirmed) {
            this.productService.markProductAsAvailable(productId).subscribe(
              response => {
                Swal.fire({
                  title: '¡Disponible nuevamente!',
                  text: 'Tu producto ahora está disponible para la venta.',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#48be79'
                });
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              },
              error => {
                console.error('Error al hacer disponible el producto', error);
                Swal.fire(
                  'Error',
                  error.error?.mensaje || 'Hubo un problema al hacer tu producto disponible. Inténtalo de nuevo más tarde.',
                  'error'
                );
              }
            );
          }
        });
      }
      
}
