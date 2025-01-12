import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
import { Categories, ProductService, Status } from '../../services/product-service/product.service';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { ErrorMessagesComponent } from '../validation/error-messages/error-messages.component';
import { Router } from '@angular/router';
import { SuccessAlertComponent } from '../alerts/success-alert/success-alert.component';
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { SvgUploadProductComponent } from "../svg-icons/svg-upload-product/svg-upload-product.component";
import { SpinnerLoadComponent } from "../../utils/spinner-load/spinner-load.component";
import { NominatimService } from '../../services/coord/nominatim.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    CapitalizeFirstPipe,
    ErrorMessagesComponent,
    SuccessAlertComponent,
    ErrorAlertComponent,
    SvgUploadProductComponent,
    SpinnerLoadComponent
],
  templateUrl: './upload-products.component.html',
  styleUrl: './upload-products.component.css'
})
export class UploadProductsComponent implements OnInit{
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

  isLoading : boolean = false;

  coords : string = '';

  constructor(private fb: FormBuilder, 
              private productService : ProductService,
              private router : Router,
              private coordService : NominatimService
  ) {
    // Inicializar el formulario reactivo
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      price: ['', [Validators.required, Validators.min(0.01), Validators.pattern("^[0-9]+([,.][0-9]{1,2})?$")]],
      status: ['', Validators.required],
      category: ['', Validators.required],
      urlImage: ['', Validators.required],
      cp: ['', [Validators.required, Validators.pattern("^[0-9]{5}$")]]
    });
  }

  ngOnInit(): void {
      this.loadStatus();
      this.loadCategories();
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
  async onSubmit() : Promise<void> {
    if (this.productForm.valid && this.selectedFiles?.length > 0) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('status', this.productForm.get('status')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      const coords = await this.getCoord(this.productForm.get('cp')?.value);
      formData.append('cp', coords)
      this.selectedFiles.forEach((file) => {
        // Puedes usar un índice para cada archivo o tratarlos como un array
        formData.append('images', file, file.name);
      });

      this.productService.uploadProduct(formData).subscribe({
        next: (response : any) => {
          this.isLoading = false;
          // Mensaje exito
          this.isSuccess = true;
          this.successTitle = `Producto ${response.name}creado correctamente`;
          // Login - redirigimos a su home
          setTimeout(()=> {
            this.router.navigate(["/home"]);
          }, 1000)
          
        },
        error: (error) => {
          console.log(error)
          this.isLoading = false;
          // Mensaje de error
          this.isError = true;
          this.titleError = "Ooops...";
          this.errorMessage = typeof error.error.mensaje === 'string' ? 
            error.error.mensaje : 
            (Object.values(error.error.mensaje)).join(' ');
        }

      })

    } else {
      this.isError = true;
      this.titleError = "Error...";
      this.errorMessage = "No se ha seleccionado ninguna imagen"
    }
  }

  getCoord(cp: string) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.coordService.getCoordinates(cp).subscribe(
        (response) => {
          resolve(response.lat + "," + response.lng);
        }, error =>{
          console.log(error)
          reject('');
        }
      )
    })

  }

  onConfirmationError() : void {
    this.isError = false;
  }
}



  


