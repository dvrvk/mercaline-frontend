import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FavoritesService {

  private apiUrlFavoriteProductslists = 'http://localhost:8080/user/favorite-product-lists'

  constructor(private http: HttpClient) { }

  getFavoriteProducts(page: number, size: number): Observable<Page<FavoriteListsResponseDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<FavoriteListsResponseDTO>>(this.apiUrlFavoriteProductslists, {headers, params});
    
  }
}

export interface FavoriteListsResponseDTO {
  id: number,
  nameList: string,
  productSize: number
}

export interface Page<T> {
  content: T[];
  page: PageContent
  
}

export interface PageContent {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
