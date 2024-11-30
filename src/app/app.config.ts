import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import {NgcCookieConsentConfig, provideNgcCookieConsent} from 'ngx-cookieconsent';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost' // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  position: 'bottom',
  theme: 'classic',  // Puedes cambiar a 'edgeless', 'wire', etc.
  palette: {
    popup: {
      background: '#000',
      text: '#fff',
    },
    button: {
      background: '#4dce83',
      text: '#000',
    },
  },
  type: 'opt-in',  // Cambiar a 'opt-out' si lo prefieres
  content: {
    message: 'Usamos cookies para mejorar tu experiencia.',
    dismiss: 'Aceptar',
    allow: 'Permitir cookies',
    deny: 'Rechazar',
    link: 'Leer más',
    href: '/politica-de-cookies',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
    provideNgcCookieConsent(cookieConfig)]
};
