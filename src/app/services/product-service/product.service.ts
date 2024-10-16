import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private apiUrl = 'http://localhost:8080/products';
  private apiUrlUser = 'http://localhost:8080/user/products'

  constructor(private http: HttpClient) { }

  getProduct(page: number, size: number): Observable<Page<ProductResponseSummaryDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<ProductResponseSummaryDTO>>(this.apiUrlUser, {headers, params});
    
  }

}

export interface ProductResponseSummaryDTO {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
  imagenUrl: string;
  precio: number;
  categoria: string;
  vendedor: ResponseUserProductDTO;
}

export interface ResponseUserProductDTO {
  id: number;
  username: string;
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



