import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories, ProductService, Status } from '../../services/product-service/product.service';
import { ErrorMessagesComponent } from "../validation/error-messages/error-messages.component";
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { SuccessAlertComponent } from "../alerts/success-alert/success-alert.component";
import { ErrorAlertComponent } from "../alerts/error-alert/error-alert.component";
import { SvgUploadProductComponent } from "../svg-icons/svg-upload-product/svg-upload-product.component";

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CapitalizeFirstPipe,
    NavbarComponent,
    ErrorMessagesComponent,
    SuccessAlertComponent,
    ErrorAlertComponent,
    SvgUploadProductComponent
],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.css'
})
export class ProductUpdateComponent {
  productForm: FormGroup;
  selectedFiles: File[] = [];

  statusList : Status[] = [];
  categoriesList : Categories[] = [];

  isError : boolean = false;
  titleError : string = '';
  errorMessage : string = '';
  imgError : string = '';

  isSuccess : boolean = false;
  successTitle : string = '';

  constructor(private fb: FormBuilder, 
              private productService : ProductService,
              private router : Router,
              private route : ActivatedRoute,
  ) {
    // Inicializar el formulario reactivo
    this.productForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      price: ['', [Validators.required, Validators.min(0.01), Validators.pattern("^[0-9]+([,.][0-9]{1,2})?$")]],
      status: ['', Validators.required],
      category: ['', Validators.required],
      urlImage: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      this.loadStatus();
      this.loadCategories();
      this.loadProduct();
  }


  loadProduct() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    if(id != 0 && id >= 1) {
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
                  urlImage: product.urlImage,
            });
            console.log(this.productForm)
            },
            error => {
              console.log(error);
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

      
      console.log('Cargando producto...')
    } else {
      console.log('Error al cargar producto...Redirigir')
    }
    
    
  }

  loadStatus() : void {
    this.productService.getStatus().subscribe(
      (datos) => {
        this.statusList = datos;
      }, 
      (error)=> {
       // Mensaje de error
       this.isError = true;
       this.titleError = "Ooops...";
       this.errorMessage = typeof error.error.mensaje === 'string' ? 
         error.error.mensaje : 
         (Object.values(error.error.mensaje)).join(' ');
      }
    )
  }

  loadCategories() : void {
    this.productService.getCategories(null, null).subscribe(
      (datos) => {
        this.categoriesList = datos.content;
      }, 
      (error)=> {
        // Mensaje de error
        this.isError = true;
        this.titleError = "Ooops...";
        this.errorMessage = typeof error.error.mensaje === 'string' ? 
          error.error.mensaje : 
          (Object.values(error.error.mensaje)).join(' ');
      }
    )
  }

  // Manejar los archivos de imagen seleccionados
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      if(input.files.length > 0 && input.files.length <= 5) {
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
  onSubmit() : void {
    if (this.productForm.valid && this.selectedFiles?.length > 0) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('status', this.productForm.get('status')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      this.selectedFiles.forEach((file) => {
        // Puedes usar un índice para cada archivo o tratarlos como un array
        formData.append('images', file, file.name);
      });

      this.productService.uploadProduct(formData).subscribe({
        next: (response : any) => {
          
          // Mensaje exito
          this.isSuccess = true;
          this.successTitle = `Producto ${response.name}creado correctamente`;
          // Login - redirigimos a su home
          setTimeout(()=> {
            this.router.navigate(["/home"]);
          }, 1000)
          
        },
        error: (error) => {
          // Mensaje de error
          this.isError = true;
          this.titleError = "Ooops...";
          this.errorMessage = typeof error.error.mensaje === 'string' ? 
            error.error.mensaje : 
            (Object.values(error.error.mensaje)).join(' ');
        }

      })

    } else {
      console.log('Formulario no válido o imagen no seleccionada');
    }
  }

  onConfirmationError() : void {
    this.isError = false;
  }

}
