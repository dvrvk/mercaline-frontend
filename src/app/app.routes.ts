import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { authGuard } from './guards/auth.guard';
import { redirectGuardGuard } from './guards/redirect-guard.guard';

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
    }
];
