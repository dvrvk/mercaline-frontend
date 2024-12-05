import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FavoriteListsResponseDTO, FavoritesService, UpdateListFavProd } from '../../services/favorites-service/favorites.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, NgModel, ReactiveFormsModule } from '@angular/forms';
import { ModalCreateFavComponent } from "../modal-create-fav/modal-create-fav.component";
import { UploadProductsComponent } from '../upload-products/upload-products.component';

@Component({
  selector: 'app-modal-fav',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalCreateFavComponent],
  templateUrl: './modal-fav.component.html',
  styleUrl: './modal-fav.component.css'
})
export class ModalFavComponent implements OnInit {
  @Input() idProduct: number | null = null;
  @Output() changed = new EventEmitter<boolean>();

  listFav: FavoriteListsResponseDTO[] = [];
  productInFavList: any[] = [];
  listToSent: UpdateListFavProd[] = [];

  showCreateList: boolean = false;


  constructor(
    private favService: FavoritesService
  ) { }

  ngOnInit(): void {
    this.favService.getFavoriteProducts(0, 10000).subscribe(
      data => {
        this.listFav = data.content ?? [];
      },
      error => {
        console.log(error)
      }
    )
  }

  onModalOpen() {
    if (this.idProduct) {
      this.favService.getProductFavList(this.idProduct).subscribe(
        data => {
          this.productInFavList = Array.isArray(data) && data.length > 0 ? data : [];
          console.log(this.productInFavList)
          console.log(this.listFav)
          this.checkFav();
        },
        error => {
          console.log(error)
        }
      )
    }
    this.showCreateList = false;

  }

  checkFav(): void {
    this.resetAndCheckProductLists();
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((checkbox: any) => {
      const checkboxId = parseInt(checkbox.id.replace('fav-', ''), 10);
      if (this.productInFavList.some(productList => productList.listFavoriteId === checkboxId)) {
        checkbox.checked = true;
      }
    });
  }

  resetAndCheckProductLists() {
    // Reseteamos todos los checkboxes (los desmarcamos)
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false;
    });
  }

  onSave(): void {
    // Saco los ID de las listas
    const selectedFavs = Array.from(document.querySelectorAll('.form-check-input.custom-checkbox'))
      .filter((checkbox): checkbox is HTMLInputElement => (checkbox as HTMLInputElement).checked)
      .map((checkbox: HTMLInputElement) => checkbox.value);
    selectedFavs

    if (this.validateIds(selectedFavs) && this.idProduct) {
      this.favService.putFavorites(this.listToSent).subscribe(
        data => {
          // MESAJE EXITO
          console.log(data) // TRUE O FALSE
          this.changed.emit(data);
          this.listToSent = [];
          // A lo mejor hay que recargar si está en favoritos el icono
        },
        error => {
          // MENSAJE ERROR
          this.listToSent = [];
        }
      )
    } else {
      console.log("mensaje de error los id de las listas no son correctos")
    }

  }

  validateIds(idsFav: any[]): boolean {
    return idsFav.every(id => this.listFav.some(fav => fav.id == id))
  }

  showForm(): void {
    this.showCreateList = !this.showCreateList;
  }

  toggleCreateList(): void {
    this.showCreateList = !this.showCreateList;
  }

  onListCreated(newList: any): void {
    // Manejar la lista recién creada
    this.listFav.push(newList);
    this.toggleCreateList(); // Volver a la vista de la lista
  }

  onChangeCheck(event: any): void {
    const id = parseInt((event.target.id).replace("fav-", ""), 10);
    const checked = event.target.checked;
    const wasInListFav = this.productInFavList.some(list => list.listFavoriteId === id);
    const idProduct = this.idProduct ?? 0;
    if (wasInListFav) {
      if (!checked) {
        this.listToSent.push({ idList: id, idProduct: idProduct, isDeleteProductList: true, isAddProductList: false })
      } else {
        this.listToSent = this.listToSent.filter(item => item.idList !== id);
      }
    } else {
      if (checked) {
        this.listToSent.push({ idList: id, idProduct: idProduct, isDeleteProductList: false, isAddProductList: true })
      } else {
        this.listToSent = this.listToSent.filter(item => item.idList !== id);
      }
    }
  }

  onCancel(): void{
    this.listToSent = [];
  }

}
