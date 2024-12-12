import { Injectable } from '@angular/core';
import { Loader, LoaderOptions } from 'google-maps';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private loader: Loader;

  constructor() {
    const options: LoaderOptions = {/* tus opciones aquí */};
    this.loader = new Loader('AIzaSyAy589iNSDkhIeDHS6N9h1MxHsnni2RPkU', options);
  }

  loadMap(element: HTMLElement, options: google.maps.MapOptions): Promise<google.maps.Map> {
    return this.loader.load().then(google => {
      return new google.maps.Map(element, options);
    });
  }
}
