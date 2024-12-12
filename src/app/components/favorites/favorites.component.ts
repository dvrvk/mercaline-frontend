
import { NavbarComponent } from '../navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { SgvNotFoundComponent } from "../svg-icons/sgv-not-found/sgv-not-found.component";
import { SvgFavoriteListsComponent } from "../svg-icons/svg-favorite-lists/svg-favorite-lists.component";
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { FavoritesService, FavoriteListsResponseDTO, Page } from '../../services/favorites-service/favorites.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SpinnerLoadNotblockComponent } from "../../utils/spinner-load-notblock/spinner-load-notblock.component";
import { ModalCreateListFavComponent } from "../modal-create-list-fav/modal-create-list-fav.component";

declare var Swal: any;

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NavbarComponent,
    CapitalizeFirstPipe,
    SgvNotFoundComponent,
    SvgFavoriteListsComponent,
    ErrorAlertComponent,
    SpinnerLoadNotblockComponent,
    ModalCreateListFavComponent
],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  // Listas de favoritos y paginacion
  favoriteLists: FavoriteListsResponseDTO[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 12;

  //Errores
  isError: boolean = false;
  errorMessage: string = "Ups, lo sentimos no hemos podido conectarnos al servidor. Por favor, intentalo más tarde."
  errorMessageAlert: string = '';
  errorTitleAlert: string = ''
  isErrorAlert: boolean = false;

  isLoading : boolean = true;

  option: string = 'create';
  idList: number | null = null;
  nameList : string | null = null;;

  constructor(
    private UserService: UserServiceService,
    private favoritesService: FavoritesService,
    private route : ActivatedRoute,
    private router: Router) { }

  // Al inicio - cargar listas de favoritos
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Si el parámetro 'page' existe, lo usamos; si no, usamos 0
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
    });
    this.loadFavoriteLists(this.currentPage, this.pageSize);
  }

  // Si cambian las listas de favoritos
  ngOnChanges(): void {
    this.loadFavoriteLists(this.currentPage, this.pageSize);
  }

  // Cargar listas de favoritos paginados
  loadFavoriteLists(page: number, size: number): void {

    this.favoritesService.getFavoriteProducts(page, size).subscribe(
      (data: Page<FavoriteListsResponseDTO>) => {

        this.favoriteLists = data.content;
        this.totalElements = data.page.totalElements;
        this.totalPages = data.page.totalPages;
        this.currentPage = data.page.number;
        this.isError = false;
        this.isLoading = false;

      },
      (error) => {
        console.error('Error al cargar las listas de favoritos', error.error)

        this.isLoading = false;

        const message = error.error && error.error.mensaje ? error.error.mensaje : "Ha ocurrido un error al cargar las listas de favoritos. Por favor, inténtalo de nuevo"
        this.onError(message, "Error al cargar las listas de favoritos");

        // Si el token no es valido se hace logout()
        this.onErrorStatus(error.error.status);
      }
    );
  }

  // Cargar listas de favoritos al cambiar de página
  onPageChange(page: number): void {
    this.loadFavoriteLists(page, this.pageSize);
  }

  private onError(message: string, title: string): void {
    this.errorMessageAlert = message;
    this.errorTitleAlert = title;
    this.isErrorAlert = true;
    this.isError = true;
  }

  private onErrorStatus(status: number): void {
    if (Number(status) === 401) {
      this.UserService.logOut();
      setTimeout(() => {
        this.router.navigate(["/login"]);
        this.isError = false;
        this.isErrorAlert = false;
      }, 100)
    }
  }

  onConfirmationError(): void {
    this.isErrorAlert = false;
  }

  onListCreated(newList: any): void {
    // Manejar la lista recién creada
    this.favoriteLists.push(newList);
  }

  onOption(option : string) {
    switch(option) {
      case 'create':
          this.option = option;
          break;
      case 'update':
        this.option = option;
        break;
      default:
        this.option = option;
    }
  }

  selectFavList(id: number, name: string) {
    this.idList = id;
    this.nameList = name;
  }

  onSuccessEdit(list: any): void {
    const index = this.favoriteLists.findIndex(fav => fav.id === list.id);
    if (index !== -1) {
      // Si se encuentra la lista, reemplázala
      this.favoriteLists[index] = list;
    } else {
      // Si no se encuentra la lista, agregarla
      this.favoriteLists.push(list);
    }
  }

  onDeleteAList(id: number): void {
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
        this.favoritesService.deleteList(id).subscribe(
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
