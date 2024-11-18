import { Component, Input, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { CommonModule, NgClass } from '@angular/common';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { ProductService } from '../../services/product-service/product.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    NavbarComponent,
    CustomCurrencyFormatPipe,
    NgClass,
    CapitalizeFirstPipe,
    CommonModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product : any = [];
  images: SafeUrl[] = [];

  constructor(private productService: ProductService,
              private route : ActivatedRoute,
              private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    // Capturar el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');
    // Cargar datos
    if(id != null) {
      this.loadProductDetails(parseInt(id));
      this.loadProductImages(parseInt(id));
    }
    
  }

  loadProductDetails(id : number) : void {
    this.productService.getProductDetails(id).subscribe(
    response => {
      console.log(response)
      this.product = response;
    },
    error => {
      console.error(error)
    })
  }

  loadProductImages(id : number): void {

    this.productService.getProductImages(id).subscribe(response => {

      if (typeof response.mensaje === 'string') {
        this.images = response.mensaje.split(',').map(item => { 
          return this.sanitizer.bypassSecurityTrustUrl(this.formatImage(item)); }); 
          console.log(this.images);
        
          // Convierte la cadena en un array y luego en URLs de datos
          //this.images = response.mensaje.split(',').map(base64 => `data:image/jpeg;base64,${base64}`);
      } else {
        console.error('Expected a string but got', response.mensaje);
      }
    });
  }

  formatImage(item: string): string { 
    if (this.isUrl(item)) { return item; } else { 
      return `data:image/jpeg;base64,${item}`; 
    } }

  isUrl(str: string): boolean { 
    // Comprueba si la cadena tiene un formato típico de URL 
    const urlPattern = /^(https?:\/\/|www\.)[^\s$.?#].[^\s]*$/; return urlPattern.test(str);
  }
}
