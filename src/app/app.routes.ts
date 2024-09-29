import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '', 
        title: 'Inicio',
        component: HomeComponent
    },
    {
        path: 'registro', 
        title: 'registro',
        component: RegistroComponent
    },
    {
        path: 'login', 
        title: 'Iniciar Sesión',
        component: LoginComponent
    }
];
