import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProductService } from '../../services/product-service/product.service';
import { SpinnerLoadNotblockComponent } from "../../utils/spinner-load-notblock/spinner-load-notblock.component";

@Component({
  selector: 'app-carousel-images',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerLoadNotblockComponent
],
  templateUrl: './carousel-images.component.html',
  styleUrl: './carousel-images.component.css'
})
export class CarouselImagesComponent implements OnChanges, OnInit{
  
  @Input() productID : number = 0;
  images: SafeUrl[] = [];
  isLoading : boolean = true;

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadProductImages(this.productID);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productID'] && !changes['productID'].isFirstChange()) {
      this.loadProductImages(this.productID);
    }

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
      this.isLoading = false;    },
      error => {
        this.images.push(this.sanitizer.bypassSecurityTrustUrl('assets/images/image_not_available.png'));
        console.error('Expected a string but got', error);
        this.isLoading = false;   
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

}
