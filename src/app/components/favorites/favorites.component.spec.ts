import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FavoritesComponent } from './favorites.component';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { FavoritesService } from '../../services/favorites-service/favorites.service';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let userServiceMock: any;
  let favoritesServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Mocks para los servicios
    userServiceMock = {
      logOut: jasmine.createSpy('logOut'),
    };

    favoritesServiceMock = {
      getFavoriteProducts: jasmine.createSpy('getFavoriteProducts').and.returnValue(
        of({
          content: [],
          page: {
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        })
      ),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        { provide: UserServiceService, useValue: userServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Realiza la inicialización del componente
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorite lists on initialization', () => {
    expect(favoritesServiceMock.getFavoriteProducts).toHaveBeenCalledWith(0, 12);
  });

  it('should handle errors when loading favorite lists', () => {
    // Simular un error en el servicio
    const error = {
      error: { mensaje: 'Error al cargar datos', status: 401 },
    };

    favoritesServiceMock.getFavoriteProducts.and.returnValue(throwError(error));
    component.loadFavoriteLists(0, 12);

    expect(component.isError).toBeTrue();
    expect(component.isErrorAlert).toBeTrue();
    expect(userServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update favorite lists on page change', () => {
    const newPage = 2;
    component.onPageChange(newPage);

    expect(favoritesServiceMock.getFavoriteProducts).toHaveBeenCalledWith(newPage, 12);
  });

  it('should reset error alert when confirming error', () => {
    component.isErrorAlert = true;
    component.onConfirmationError();

    expect(component.isErrorAlert).toBeFalse();
  });
});
