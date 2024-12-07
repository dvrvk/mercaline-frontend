import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FavoritesService } from '../../services/favorites-service/favorites.service';
import { CommonModule } from '@angular/common';

declare var Swal: any;

@Component({
  selector: 'app-favourites-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favourites-icon.component.html',
  styleUrl: './favourites-icon.component.css'
})
export class FavouritesIconComponent implements OnChanges{
  isError: boolean = false;
  errorMessage: string =
    'Ups, lo sentimos no hemos podido conectarnos al servidor. Por favor, intentalo más tarde.';

  @Input() productId : number = 0;
  @Input() listId : number = 0;
  @Input() initClass : string = 'bi-heart';
  @Input() action : string = 'unlike';
  @Input() favoriteAction : boolean = false;
  @Input() favChanged : boolean = false;
  

  showModal: boolean = false;



  constructor(private favoritesService : FavoritesService) {}


  ngOnChanges(changes: SimpleChanges): void {
    this.loadFavorites()
  }

  loadFavorites() : void {
    this.favoritesService.getProductFavList(this.productId).subscribe(
      data => {
        this.initClass = Array.isArray(data) && data.length > 0 ? 'bi-heart-fill': 'bi-heart';
        this.action = data ? 'unlike' : 'like';
      }, 
      error => {
        console.log(error)

      }
    )
  }



  onHover(): void {
    // Cambia a "bi-heart-half" si la clase actual es "bi-heart-fill"
    if (this.initClass === 'bi-heart-fill') {
      this.initClass = 'bi-heart';
    } else if (this.initClass === 'bi-heart') {
      this.initClass = 'bi-heart-fill';
    }
  }

  onLeave(): void {

    if (this.initClass === 'bi-heart') {
      this.initClass = 'bi-heart-fill';
    } else {
      this.initClass = 'bi-heart';
    }
  }

  onClick() : void {
    if(this.action == 'unlike') {
      this.onDeleteProductFromAList();
    } else {
      this.showModal = true;
      this.onAddProductFromAList();
    }
  }

  onAddProductFromAList() : void {
    console.log('agregando...')
  }


  onDeleteProductFromAList(): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar el producto de tu lista de favoritos?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#48be79',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.favoritesService.deleteProductFromAList(this.productId, this.listId).subscribe(
          response => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'Tu producto ha sido eliminado de tu lista de favoritos.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#48be79'
          });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
           
          },
          error => {
            console.error('Error al eliminar el producto de tu lista de favoritos', error);
            Swal.fire(
              'Error',
              error.error?.mensaje || 'Hubo un problema al eliminar tu producto de tu lista de favoritos. Inténtalo de nuevo más tarde.',
              'error'
            );
          }
        );
      }
    })
  }


}
