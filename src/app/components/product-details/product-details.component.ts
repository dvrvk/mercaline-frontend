import { Component, Input, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { CommonModule, NgClass } from '@angular/common';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { ProductService } from '../../services/product-service/product.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { SpinnerLoadNotblockComponent } from "../../utils/spinner-load-notblock/spinner-load-notblock.component";
import { CarouselImagesComponent } from "../carousel-images/carousel-images.component";
import { FavouritesIconComponent } from "../favourites-icon/favourites-icon.component";
import { ModalFavComponent } from "../modal-fav/modal-fav.component";


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    NavbarComponent,
    CustomCurrencyFormatPipe,
    CapitalizeFirstPipe,
    CommonModule,
    RouterLink,
    SpinnerLoadNotblockComponent,
    CarouselImagesComponent,
    FavouritesIconComponent,
    ModalFavComponent
],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: any = [];
  images: SafeUrl[] = [];

  currentPage: number = 0;
  currentCategory : number = 0;

  isProductLoading : boolean = true;
  referrer: string = '/home';

  selectedProductId: number | null = null;

  changedFav : boolean = false;

  constructor(private productService: ProductService,
              private route : ActivatedRoute,
              private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe((params) => {
      // Si el parámetro 'page' existe, lo usamos; si no, usamos 0
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.currentCategory = params['category'] ? parseInt(params['category'], 10) : 0;
      this.referrer = params['referrer'] ? params['referrer'] : '/home';
    });

    // Capturar el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');
    // Cargar datos
    if (id != null) {
      this.loadProductDetails(parseInt(id));
      this.loadProductImages(parseInt(id));
    }

  }

  loadProductDetails(id: number): void {
    this.productService.getProductDetails(id).subscribe(
      response => {
        this.isProductLoading = false;
        this.product = response;
      },
      error => {
        console.error(error)
        this.isProductLoading = false;
      })

  }

  loadProductImages(id: number): void {

    this.productService.getProductImages(id).subscribe(response => {

      if (typeof response.mensaje === 'string') {
        this.images = response.mensaje.split(',').map(item => {
          return this.sanitizer.bypassSecurityTrustUrl(this.formatImage(item));
        });

      } else {
        this.images.push(this.sanitizer.bypassSecurityTrustUrl('assets/images/not_found.png'));
        console.error('Expected a string but got', response.mensaje);
      }
    },
      error => {
        this.images.push(this.sanitizer.bypassSecurityTrustUrl('assets/images/image_not_available.png'));
        console.error('Expected a string but got', error);
      }
    );

  }

  formatImage(item: string): string {
    if (this.isUrl(item)) { return item; } else {
      return `data:image/jpeg;base64,${item}`;
    }
  }

  isUrl(str: string): boolean {
    // Comprueba si la cadena tiene un formato típico de URL 
    const urlPattern = /^(https?:\/\/|www\.)[^\s$.?#].[^\s]*$/; return urlPattern.test(str);
  }

  getProductID() : number {
    return parseInt(this.route.snapshot.paramMap.get('id')|| '0', 10);
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
