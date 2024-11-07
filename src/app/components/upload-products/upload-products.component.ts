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

@Component({
  selector: 'app-upload-products',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    NavbarComponent, 
    CapitalizeFirstPipe, 
    ErrorMessagesComponent, 
    SuccessAlertComponent,
    ErrorAlertComponent],
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

  isSuccess : boolean = false;
  successTitle : string = '';

  constructor(private fb: FormBuilder, 
              private productService : ProductService,
              private router : Router
  ) {
    // Inicializar el formulario reactivo
    this.productForm = this.fb.group({
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
  }

  loadStatus() : void {
    this.productService.getStatus().subscribe(
      (datos) => {
        this.statusList = datos;
      }, 
      (error)=> {
        console.log(error);
      }
    )
  }

  loadCategories() : void {
    this.productService.getCategories(null, null).subscribe(
      (datos) => {
        this.categoriesList = datos.content;
      }, 
      (error)=> {
        console.log(error);
      }
    )
  }

  // Manejar los archivos de imagen seleccionados
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        // Convierte la lista de archivos a un array y guárdalos
        this.selectedFiles = Array.from(input.files);
        console.log("Archivos seleccionados:", this.selectedFiles);
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
          console.log(error);
          // Mensaje de error
          // this.isError = true;
          // this.titleError = "Ooops...";
          // this.errorMessage = (Object.values(error.error.mensaje)).join(' ');

        }

      })

    } else {
      console.log('Formulario no válido o imagen no seleccionada');
    }
  }
}



  


