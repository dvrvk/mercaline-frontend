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
import { FavouritesIconComponent } from "../favourites-icon/favourites-icon.component";
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
    RouterLink,
    FavouritesIconComponent,
    SpinnerLoadNotblockComponent
],
  templateUrl: './product-in-a-list.component.html',
  styleUrls: ['./product-in-a-list.component.css'],
})
export class ProductsInAListComponent implements OnInit {

  list: FavoriteProductsInAListResponseDTO[] = [];

  currentPage: number = 0;
  pageSize: number = 12;
  selectedCategoryId: number = 0;


  isError: boolean = false;
  errorMessage: string =
    'Ups, lo sentimos no hemos podido conectarnos al servidor. Por favor, intentalo más tarde.';
  errorMessageAlert: string = '';
  errorTitleAlert: string = '';
  isErrorAlert: boolean = false;

  isLoading : boolean = true;

  constructor(
    private favoritesService: FavoritesService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Si el parámetro 'page' existe, lo usamos; si no, usamos 0
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
    });
    this.loadUserProducts();
  }

  loadUserProducts(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
      this.favoritesService.getFavoriteProductsInAList(id).subscribe(
        (data) => {
          this.list = data;
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
    this.isLoading = false;
  }

  onViewProduct(productId: number, listId : number) : void {
    this.router.navigate([`/detalles-producto/${productId}`], {
      queryParams: { page: this.currentPage,
                     referrer : `/favorite-list/${listId}`
                  }
    });
  }
}
