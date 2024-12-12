import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { GoogleMapsService } from '../../services/google-maps.service';
import { NominatimService } from '../../services/coord/nominatim.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() cp : string | null = null;
  isMapLoaded: boolean = true; // Variable de estado para el mapa


  constructor(private googleMapsService : GoogleMapsService, 
              private nominatimService : NominatimService) {}

  ngAfterViewInit(): void {
    if(this.cp != null) {
      if (this.mapContainer) {
        
        const [lat, lon] = this.cp.split(",").map(coord => parseFloat(coord))
        console.log(lat)

        const mapOptions: google.maps.MapOptions = {
          center: { lat: lat, lng: lon },
          zoom: 8
        };

        const latLng: google.maps.LatLngLiteral = { 
          lat: lat,
          lng: lon
        };
  
        this.googleMapsService.loadMap(this.mapContainer.nativeElement, mapOptions)
          .then(map => {
                map.setCenter(latLng);
                map.setZoom(12);
              

              new google.maps.Circle({ 
                map: map, 
                center: latLng, 
                radius: 2000, 
                fillColor: '#48be79', 
                fillOpacity: 0.35, 
                strokeColor: '#48be79', 
                strokeOpacity: 0.8, 
                strokeWeight: 2 
              });
              this.isMapLoaded = true; // Indicar que el mapa se cargó correctamente
          })
          .catch(err => {
            console.error('Error al cargar el mapa:', err);
            this.isMapLoaded = false; // Indicar que el mapa no se cargó
          });
      } else {
        console.error('mapContainer is undefined');
        this.isMapLoaded = false; // Indicar que el mapa no se cargó
      }
    } else {
      this.isMapLoaded = false; // Indicar que el mapa no se cargó
    }
  }
  
}

