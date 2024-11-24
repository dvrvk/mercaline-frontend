import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product-service/product.service';
import { UserServiceService } from '../../services/user-service/user-service.service'; // Importa tu servicio de usuario
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../navbar/navbar.component';
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  standalone:true,
  imports: [
    NavbarComponent,
    CustomCurrencyFormatPipe,
    CapitalizeFirstPipe,
    CommonModule,
    RouterModule
  ]
})
export class ProductDetailsComponent implements OnInit {
  product: any = [];
  images: SafeUrl[] = [];
  isUserProduct: boolean = false;

  currentPage: number = 0;
  currentCategory: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.currentCategory = params['category'] ? parseInt(params['category'], 10) : 0;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.loadProductDetails(parseInt(id));
      this.loadProductImages(parseInt(id));
    }
  }

  loadProductDetails(id: number): void {
    this.productService.getProductDetails(id).subscribe(
      response => {
        this.product = response;
        const userId = this.userService.getUserId(); // Obtén el ID del usuario actual
        this.isUserProduct = userId === this.product.seller.id; // Comprueba si el producto pertenece al usuario actual
      },
      error => {
        console.error(error);
      }
    );
  }

  loadProductImages(id: number): void {
    this.productService.getProductImages(id).subscribe(
      response => {
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
    return this.isUrl(item) ? item : `data:image/jpeg;base64,${item}`; 
  }

  isUrl(str: string): boolean {
    const urlPattern = /^(https?:\/\/|www\.)[^\s$.?#].[^\s]*$/; 
    return urlPattern.test(str);
  }

  onEditProduct(id: number): void {
    this.router.navigate(['/editar-producto', id]);
  }

  onDeleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.router.navigate(['/mis-productos']);
        },
        error => {
          console.error('Error al eliminar el producto:', error);
          alert('Ocurrió un error al eliminar el producto. Inténtalo de nuevo.');
        }
      );
    }
  }
}
