import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NominatimService {
  private baseUrl = 'https://api.distancematrix.ai/maps/api/geocode/json?address=';
  private key = 'DBg76Ih7B43GUpl65mOSrKdLYzcmyh5H2KwGY4tooIVxdQCvBogtxgra5GiRIpJI';

  constructor(private http: HttpClient) {}

  getCoordinates(postalCode: string): Observable<{ lat: number; lng: number }> {
    return this.http.get<any>(this.baseUrl + postalCode + ",+ES&key=" + this.key).pipe(
      map((response)=> {
        if (response.status === 'OK' && response.result.length > 0) {
          const location = response.result[0].geometry.location;
          return { lat: location.lat, lng: location.lng };
        } else {
          throw new Error('No se encontraron resultados o el estado no es OK');
        }

      })
    );
  }
}
