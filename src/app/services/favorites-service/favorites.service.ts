import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class FavoritesService {

  private apiUrlFavoriteProductsLists = 'http://localhost:8080/user/favorite-product-lists'
  private apiUrlFavoriteProductsInAlist = 'http://localhost:8080/user/favorite-products-in-list/'

  constructor(private http: HttpClient) { }

  getFavoriteProducts(page: number, size: number): Observable<Page<FavoriteListsResponseDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<FavoriteListsResponseDTO>>(this.apiUrlFavoriteProductsLists, {headers, params});
    
  }

  getFavoriteProductsInAList(page: number, size: number, idList: number): Observable<Page<FavoriteProductsInAListResponseDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<FavoriteProductsInAListResponseDTO>>(this.apiUrlFavoriteProductsInAlist + idList, {headers, params});
    
  }

  deleteProductFromAList(idProduct: number, idList: number): Observable<Page<FavoriteProductsInAListResponseDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<Page<FavoriteProductsInAListResponseDTO>>(`http://localhost:8080/user/delete-product/${idProduct}/favorite-list/${idList}`, {headers});
    
  }
}

export interface FavoriteListsResponseDTO {
  id: number,
  nameList: string,
  productSize: number
}

export interface ProductResponseDTO {
  id: number,
  name: string,
  description: string,
  status: string,
  imageUrl: SafeUrl | string,
  price: number,
  category: string
}

export interface FavoriteProductsInAListResponseDTO {
  id: number;
  nameList: string;
  products: ProductResponseDTO
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
