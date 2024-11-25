import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { authGuard } from './guards/auth.guard';
import { redirectGuardGuard } from './guards/redirect-guard.guard';
import { UploadProductsComponent } from './components/upload-products/upload-products.component';
import { FavoritesComponent } from "./components/favorites/favorites.component";
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { ProductUpdateComponent } from './components/product-update/product-update.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'registro', 
        title: 'registro',
        component: RegistroComponent
    },
    {
        path: 'login', 
        title: 'Iniciar Sesión',
        component: LoginComponent,
        canActivate: [redirectGuardGuard]
    },
    {
        path: 'home',
        title: 'Home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'perfil',
        title: 'Perfil',
        component: PerfilComponent,
        canActivate: [authGuard]
    }, 
    {
        path: 'subir-producto',
        title: 'Subir producto',
        component: UploadProductsComponent,
        canActivate: [authGuard]
    }, 
    {
        path: 'favorites',
        title: 'Productos favoritos',
        component: FavoritesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'detalles-producto/:id',
        title: 'Detalles producto',
        component: ProductDetailsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'mis-productos',
        title: 'Mis productos',
        component: MyProductsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'actualizar-producto/:id',
        title: 'Actualizar producto',
        component: ProductUpdateComponent,
        canActivate: [authGuard]
    }
];
