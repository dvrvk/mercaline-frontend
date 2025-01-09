import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class FavoritesService {

  private apiUrl = environment.apiUrl;
  private apiUrlFavoriteProductsLists = this.apiUrl + '/user/favorite-product-lists'
  private apiUrlFavoriteProductsInAlist = this.apiUrl + '/user/favorite-products-in-list/'

  constructor(private http: HttpClient) { }

  getFavoriteProducts(page: number, size: number): Observable<Page<FavoriteListsResponseDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<FavoriteListsResponseDTO>>(this.apiUrlFavoriteProductsLists, {headers, params});
    
  }

  getFavoriteProductsInAList(idList: number): Observable<Array<FavoriteProductsInAListResponseDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Array<FavoriteProductsInAListResponseDTO>>(this.apiUrlFavoriteProductsInAlist + idList, {headers});
    
  }

  deleteProductFromAList(idProduct: number, idList: number): Observable<Page<FavoriteProductsInAListResponseDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<Page<FavoriteProductsInAListResponseDTO>>(`${this.apiUrl}/user/delete-product/${idProduct}/favorite-list/${idList}`, {headers});
    
  }

  getProductFavList(idProduct : number) : Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<boolean>(`${this.apiUrl}/user/product-fav-list/${idProduct}`, {headers});
  }

  putFavorites(body : UpdateListFavProd[]) : Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<boolean>(`${this.apiUrl}/user/update-favs`, body, { headers });
  }

  createNewList(name : string) :Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<number>(`${this.apiUrl}/user/create-list-fav`, name, {headers});
  }

  editList(name: string, id : number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<number>(`${this.apiUrl}/user/edit-list-fav`, {name, id}, {headers});
  }

  deleteList(idList : number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<number>(`${this.apiUrl}/user/delete-list-fav/${idList}`, {headers});
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
  sold: boolean
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

export interface UpdateListFavProd {
  idList : number,
  idProduct: number,
  isDeleteProductList: boolean,
  isAddProductList: boolean
}
