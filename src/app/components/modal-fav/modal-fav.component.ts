import { Component, Input, OnInit } from '@angular/core';
import { FavoriteListsResponseDTO, FavoritesService } from '../../services/favorites-service/favorites.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-fav',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-fav.component.html',
  styleUrl: './modal-fav.component.css'
})
export class ModalFavComponent implements OnInit{
  @Input() idProduct : number | null = null;

  listFav : FavoriteListsResponseDTO[] = [];
  productInFavList : any[] = [];


  constructor(
    private favService: FavoritesService
  ) {}

  ngOnInit(): void {
      this.favService.getFavoriteProducts(0,10000).subscribe(
        data => {
          this.listFav = data.content ?? [];
        },
        error => {
          console.log(error)
        }
      )
  }

  onModalOpen() {
    if(this.idProduct) {
      this.favService.getProductFavList(this.idProduct).subscribe(
        data => {
          this.productInFavList = Array.isArray(data) && data.length > 0 ? data : [];
          this.checkFav();
        }, 
        error => {
          console.log(error)
        }
      )
    }
    
  }

  checkFav() : void {
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

  onSave() : void {
    console.log("guardando");
  }


}
