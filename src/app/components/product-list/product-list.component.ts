import { Component, Input, OnInit } from '@angular/core';
import { ProductService, ProductResponseSummaryDTO, Page, FilterClass } from '../../services/product-service/product.service';
import { CommonModule } from '@angular/common';
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { CategoryService } from '../../services/category/category.service';
import { SgvNotFoundComponent } from "../svg-icons/sgv-not-found/sgv-not-found.component";
import { FilterComponent } from "../filter/filter.component";
import { OrderByProductsComponent } from '../order-by-products/order-by-products.component';
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { SpinnerLoadNotblockComponent } from "../../utils/spinner-load-notblock/spinner-load-notblock.component";
import { FavouritesIconComponent } from "../favourites-icon/favourites-icon.component";
import { ModalFavComponent } from "../modal-fav/modal-fav.component";

declare var Swal: any;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyFormatPipe,
    CapitalizeFirstPipe,
    SgvNotFoundComponent,
    FilterComponent,
    OrderByProductsComponent,
    ErrorAlertComponent,
    RouterModule,
    SpinnerLoadNotblockComponent,
    FavouritesIconComponent,
    ModalFavComponent
],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent {
  // Productos y paginacion
  products: ProductResponseSummaryDTO[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 12;

  // Categoria seleccionada
  selectedCategory: string = '';
  selectedCategoryId: number = 0;
  categoryPage : number = 0;

  // Indiciador de filtros aplicados
  arefiltersApplied: boolean = false;
  filterApplied: FilterClass | null = null;
  orderApplied: string | null = null;

  //Errores
  isError: boolean = false;
  errorMessage: string = "Ups, lo sentimos no hemos podido conectarnos al servidor. Por favor, intentalo más tarde."
  errorMessageAlert: string = '';
  errorTitleAlert: string = ''
  isErrorAlert: boolean = false;

  isLoading : boolean = true;

  selectedProductId: number | null = null;

  changedFav : boolean = false;

  constructor(
    private productService: ProductService,
    private UserService: UserServiceService,
    private router: Router,
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute) { }

  // Al inicio - cargar productos y suscribir los cambios de categoria
  ngOnInit(): void {
    // Para mantener la página al volver de detalles producto
    this.activatedRoute.queryParams.subscribe((params) => {
      this.categoryPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.selectedCategoryId = params['category'] ? parseInt(params['category'], 10) : 0;
      
        if(this.selectedCategoryId == 0) {
          this.loadProducts(this.categoryPage, this.pageSize);
        } else {
          
          this.loadProductsByCategory(this.categoryPage, this.pageSize, this.selectedCategoryId);
        }
        
      })


    // this.loadProducts(this.currentPage, this.pageSize);
    this.categoryService.selectedCategory$.subscribe((category: any) => {
      if (Object.keys(category).length != 0) {
        this.selectedCategory = category[1];
        this.selectedCategoryId = category[0];

        this.loadProductsByCategory(0, this.pageSize, category[0]);
        
      }
    });
    
  }


  // Si cambian los productos
  ngOnChanges(): void {
    this.loadProducts(this.currentPage, this.pageSize);
  }

  // Al aplicar filtros volver a cargar productos
  onFiltersApplied(filters: FilterClass) {
    console.log('peticion filtros')
    this.filterApplied = filters;
    this.productService.getProductsFilter(0, this.pageSize, this.selectedCategoryId, filters, this.orderApplied)
      .subscribe((data) => {
        this.products = data.content;
        this.totalElements = data.page.totalElements;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number;
        this.getImages(data.content);
      },
        (error) => {
          const message = error.error && error.error.mensaje ? error.error.mensaje : "Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo"
          this.onError(message, "Error al cargar los productos");

          // Si el token no es valido se hace logout()
          this.onErrorStatus(error.error.status);
        })
  }

  // Indiciar que se han incorporado filtros
  onFilterChange(areFilter: boolean) {
    this.arefiltersApplied = areFilter;
  }

  // Ordenar los productos
  onOrderApplied(order: string) {
    this.orderApplied = order;
    console.log('peticion order' + order)
    this.productService.getProductsFilter(0, this.pageSize, this.selectedCategoryId, this.filterApplied, this.orderApplied)
      .subscribe((data) => {
        this.products = data.content;
        this.totalElements = data.page.totalElements;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number;
        this.getImages(data.content);
      },
        (error) => {
          const message = error.error && error.error.mensaje ? error.error.mensaje : "Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo"
          this.onError(message, "Error al cargar los productos");

          // Si el token no es valido se hace logout()
          this.onErrorStatus(error.error.status);
        })
  }

  // Cargar los productos filtrando por categoria
  loadProductsByCategory(page: number, size: number, categoryId: number): void {

    this.productService.getProductsByCategory(page, size, categoryId).subscribe(
      (data: Page<ProductResponseSummaryDTO>) => {

        this.products = data.content.filter(product => product.status !== 'vendido' );
        this.totalElements = data.page.totalElements;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number;
        this.isError = false;

        this.getImages(data.content);

      },
      (error) => {
        const message = error.error && error.error.mensaje ? error.error.mensaje : "Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo"
        this.onError(message, "Error al cargar los productos");

        // Si el token no es valido se hace logout()
        this.onErrorStatus(error.error.status);
      }
    );

  }

  // Cargar productos paginados
  loadProducts(page: number, size: number): void {

    this.productService.getProduct(page, size).subscribe(
      (data: Page<ProductResponseSummaryDTO>) => {

        this.products = data.content.filter(product => product.status !== 'vendido');
        this.totalElements = data.page.totalElements;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number;
        this.isError = false;
        console.log(data)

        this.getImages(data.content);
      },
      (error) => {
        this.isLoading = false;
        const message = error.error && error.error.mensaje ? error.error.mensaje : "Ha ocurrido un error al cargar los productos. Por favor, inténtalo de nuevo"
        this.onError(message, "Error al cargar los productos");

        // Si el token no es valido se hace logout()
        this.onErrorStatus(error.error.status);
      }
    );

  }

  // Cargar productos al cambiar de página
  onPageChange(page: number): void {
    this.loadProducts(page, this.pageSize);
  }

  private onError(message: string, title: string): void {
    this.errorMessageAlert = message;
    this.errorTitleAlert = title;
    this.isErrorAlert = true;
    this.isError = true;
  }

  private onErrorStatus(status: number): void {
    if (Number(status) === 401) {
      this.UserService.logOut();
      setTimeout(() => {
        this.router.navigate(["/login"]);
        this.isError = false;
        this.isErrorAlert = false;
      }, 100)

    }
  }

  onConfirmationError(): void {
    this.isErrorAlert = false;
  }

  getImages(products: ProductResponseSummaryDTO[]): void {
    // Hacer la petición para cada producto para obtener su imagen
    this.products.forEach((product) => {
      this.productService.getProductImage(product.id).subscribe(
        (imageBlob) => {
          if (imageBlob instanceof Blob) {
            if (imageBlob.type.startsWith('image/')) {
              // Convertir el Blob a un Object URL
              const objectURL = URL.createObjectURL(imageBlob);
              // Sanitize la URL para Angular y agregarla al array de imágenes
              product.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            } else {
              product.imageUrl = product.imageUrl;
            }
          }
          this.isLoading = false;

        },
        (error) => {
          product.imageUrl = this.sanitizer.bypassSecurityTrustUrl('assets/images/image_not_available.png');
        }
      );
    });
  }

  onViewProduct(productId: number) : void {
    this.router.navigate([`/detalles-producto/${productId}`], {
      queryParams: { page: this.currentPage,
                     category : this.selectedCategoryId
                  }
    });
  }

  onProductSelected(productId: number): void {
    this.selectedProductId = productId;
  }

  onChangedFav(changed : boolean) {
    if(changed) {
      this.changedFav = !this.changedFav;
    }
  }

}





