import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories, ProductService, Status } from '../../services/product-service/product.service';
import { ErrorMessagesComponent } from "../validation/error-messages/error-messages.component";
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { SuccessAlertComponent } from "../alerts/success-alert/success-alert.component";
import { ErrorAlertComponent } from "../alerts/error-alert/error-alert.component";
import { CarouselImagesComponent } from "../carousel-images/carousel-images.component";
import { SpinnerLoadComponent } from "../../utils/spinner-load/spinner-load.component";
import { CustomCurrencyFormatPipe } from '../../utils/custom-currency/custom-currency-format.pipe';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CapitalizeFirstPipe,
    NavbarComponent,
    ErrorMessagesComponent,
    SuccessAlertComponent,
    ErrorAlertComponent,
    CarouselImagesComponent,
    SpinnerLoadComponent
],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.css'
})
export class ProductUpdateComponent {
  productForm: FormGroup;
  selectedFiles: File[] = [];
  selectedOption: string = 'no-modificar';
  imagesLength: number = 0;

  statusList: Status[] = [];
  categoriesList: Categories[] = [];

  isError: boolean = false;
  titleError: string = '';
  errorMessage: string = '';
  imgError: string = '';

  isSuccess: boolean = false;
  successTitle: string = '';

  isLoading : boolean = true;

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // Inicializar el formulario reactivo
    this.productForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      price: ['', [Validators.required, Validators.min(0.01), Validators.pattern("^[0-9]+([,.][0-9]{1,2})?$")]],
      status: ['', Validators.required],
      category: ['', Validators.required],
      urlImage: [''],
      selectedOption: ['no-modificar']
    });
  }

  ngOnInit(): void {
    this.loadStatus();
    this.loadCategories();
    this.loadProduct();
  }


  loadProduct() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    if (id != 0 && id >= 1) {
      this.productService.checkIsMine(id).subscribe(
        respuesta => {
          this.productService.getProductDetails(id).subscribe(
            product => {
              // Rellenar el formulario con los datos del producto
              this.productForm.patchValue({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                status: product.statusId,
                category: product.id_category,
              });
              this.imagesLength = product.imageURL.split(';').length;
              this.isLoading = false;
            },
            error => {
              this.isError = true;
              this.titleError = "Ooops...";
              this.errorMessage = "No se han podido cargar los productos."
            }
          )
        },
        error => {
          this.isError = true;
          this.titleError = "Error";
          this.errorMessage = error.error.mensaje;
          setTimeout(() => {
            this.router.navigate(["/home"]);
          }, 1000);
        }
      )
    } else {
      this.isError = true;
      this.titleError = "Error";
      this.errorMessage = "El id tiene que ser mayor a 0";
      setTimeout(() => {
        this.router.navigate(["/home"]);
      }, 1000);
    }


  }

  loadStatus(): void {
    this.productService.getStatus().subscribe(
      (datos) => {
        this.statusList = datos;
      },
      (error) => {
        // Mensaje de error
        this.isError = true;
        this.titleError = "Ooops...";
        this.errorMessage = typeof error.error.mensaje === 'string' ?
          error.error.mensaje :
          (Object.values(error.error.mensaje)).join(' ');
      }
    )
  }

  loadCategories(): void {
    this.productService.getCategories(null, null).subscribe(
      (datos) => {
        this.categoriesList = datos.content;
      },
      (error) => {
        // Mensaje de error
        this.isError = true;
        this.titleError = "Ooops...";
        this.errorMessage = typeof error.error.mensaje === 'string' ?
          error.error.mensaje : (Object.values(error.error.mensaje)).join(' ');
      }
    )
  }

  // Manejar los archivos de imagen seleccionados
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      if (input.files.length > 0 && input.files.length <= 5) {
        // Convierte la lista de archivos a un array
        this.selectedFiles = Array.from(input.files);
      } else {
        this.imgError = 'Se requiere mínimo 1 imagen y máximo 5.'
        this.selectedFiles = [];
      }
    } else {
      this.imgError = 'Se requiere mínimo 1 imagen y máximo 5.'
      this.selectedFiles = [];
    }
  }

  // Enviar el formulario
  onSubmit(): void {
    if (this.productForm.valid && this.validateImages()) {
      const formData = new FormData();
      formData.append('id', this.productForm.get('id')?.value)
      formData.append('name', (this.productForm.get('name')?.value).toUpperCase());
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('status', this.productForm.get('status')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      formData.append('imageOption', this.productForm.get('selectedOption')?.value)
      
      if(this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file) => {
          // Puedes usar un índice para cada archivo o tratarlos como un array
          formData.append('images', file, file.name);
        });
      }
      this.isLoading = true;
      this.productService.putProduct(formData).subscribe(
        next => {
          this.isLoading = false;
          this.isSuccess = true;
          this.successTitle = 'Producto actualizado con exito';
          setTimeout(() => {
            window.location.reload();
          }, 800);
          
        },
        error => {
          this.isLoading = false;
          this.isError = true;
          this.titleError = 'Oops...'
          this.errorMessage = typeof error.error.mensaje === 'string' ?
          error.error.mensaje :
          (Object.values(error.error.mensaje)).join(' ');
        }
      )

    } else {
      this.isError = true;
      this.titleError = 'Oops...'
      this.errorMessage = 'Algún campo del formulario no es válido.';
    }
  }

  validateImages(): boolean {
    let valid = false;
    switch (this.productForm.get('selectedOption')?.value) {
      case 'no-modificar':
        valid = true;
        break;
      case 'sustituir':
        if (this.selectedFiles.length > 0 && this.selectedFiles.length <= 5) {
          valid = true;
        } else {
          this.imgError = `Puedes añadir hasta 5 imágenes, con un mínimo de una..`
          valid = false;
        }
        break;
      case 'agregar':
        const max = 5 - this.imagesLength;
        if (this.selectedFiles.length > 0 && this.selectedFiles.length <= max) {
          valid = true;
          this.imgError = '';
        } else {
          // comunicar error - marcar error
          valid = false;
          this.imgError = `Puedes añadir hasta ${max} imágenes, con un mínimo de una.`
        }
        break;
      default:
        valid = false;
        this.imgError = 'Opción de imagen no válida.';
        break;
    }

    return valid;
  }

  onConfirmationError(): void {
    this.isError = false;
  }

  getProductID(): number {
    return parseInt(this.productForm.get('id')?.value || '0', 10);
  }

}
