import { Component, OnInit } from '@angular/core';
import { FavoritesService, FavoriteProductsInAListResponseDTO } from '../../services/favorites-service/favorites.service';
import { ProductService } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { Router, RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { SgvNotFoundComponent } from '../svg-icons/sgv-not-found/sgv-not-found.component';
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NavbarComponent } from '../navbar/navbar.component';

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
    RouterLink
  ],
  templateUrl: './product-in-a-list.component.html',
  styleUrls: ['./product-in-a-list.component.css'],
})
export class ProductsInAListComponent implements OnInit {

  list: FavoriteProductsInAListResponseDTO[] = [];

  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 12;
  selectedCategoryId: number = 0;
  isError: boolean = false;
  errorMessage: string =
    'Ups, lo sentimos no hemos podido conectarnos al servidor. Por favor, intentalo más tarde.';
  errorMessageAlert: string = '';
  errorTitleAlert: string = '';
  isErrorAlert: boolean = false;

  constructor(
    private favoritesService: FavoritesService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadUserProducts(this.currentPage, this.pageSize);
  }

  loadUserProducts(page: number, size: number): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
      this.favoritesService.getFavoriteProductsInAList(page, size, id).subscribe(
        (data) => {
          this.list = data.content;
          this.totalElements = data.page.totalElements;
          this.totalPages = data.page.totalPages;
          this.currentPage = data.page.number;
          this.isError = false;

          this.getImages()
        },
        (error) => {
          console.error('Error al cargar los productos del usuario', error);
          this.onError(
            'Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo',
            'Error al cargar los productos'
          );
          this.isError = true;
        }
      );
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadUserProducts(page, this.pageSize);
    }
  }

  onDeleteProductFromAList(productId: number, listId: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar el producto de tu lista de favoritos?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#48be79',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.favoritesService.deleteProductFromAList(productId, listId).subscribe(
          response => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'Tu producto ha sido eliminado de tu lista de favoritos.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#48be79'
          });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
           
          },
          error => {
            console.error('Error al eliminar el producto de tu lista de favoritos', error);
            Swal.fire(
              'Error',
              error.error?.mensaje || 'Hubo un problema al eliminar tu producto de tu lista de favoritos. Inténtalo de nuevo más tarde.',
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
    this.list.forEach((product) => {
      this.productService.getProductImage(product.products.id).subscribe(
        (imageBlob) => {
          if (imageBlob instanceof Blob) {
            if (imageBlob.type.startsWith('image/')) {
              const objectURL = URL.createObjectURL(imageBlob);
              product.products.imageUrl =
                this.sanitizer.bypassSecurityTrustUrl(objectURL);
            } else {
              product.products.imageUrl = product.products.imageUrl;
            }
          }
        },
        (error) => {
          product.products.imageUrl = this.sanitizer.bypassSecurityTrustUrl(
            'assets/images/not_found.png'
          );
        }
      );
    });
  }
}
