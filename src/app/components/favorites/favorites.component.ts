
import { NavbarComponent } from '../navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { SgvNotFoundComponent } from "../svg-icons/sgv-not-found/sgv-not-found.component";
import { SvgFavoriteListsComponent } from "../svg-icons/svg-favorite-lists/svg-favorite-lists.component";
import { ErrorAlertComponent } from '../alerts/error-alert/error-alert.component';
import { CapitalizeFirstPipe } from '../../utils/capitalizeFirst/capitalize-first.pipe';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { FavoritesService, FavoriteListsResponseDTO, Page } from '../../services/favorites-service/favorites.service';
import { Router, RouterModule } from '@angular/router';

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
    ErrorAlertComponent],
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

  constructor(
    private UserService: UserServiceService,
    private favoritesService: FavoritesService,
    private router: Router) { }

  // Al inicio - cargar listas de favoritos
  ngOnInit(): void {
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

      },
      (error) => {
        console.error('Error al cargar las listas de favoritos', error.error)

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
}
