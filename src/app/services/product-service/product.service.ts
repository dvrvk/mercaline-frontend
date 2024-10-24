import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private apiUrlCategories = 'http://localhost:8080/products/categories';
  private apiUrlStatus = 'http://localhost:8080/products/status';
  private apiUrlUser = 'http://localhost:8080/user/products'
  private apiUrlfindByCategory = `http://localhost:8080/products/category/`;
  private apiUrlFilter = 'http://localhost:8080/products/filter';

  constructor(private http: HttpClient) { }

  getProduct(page: number, size: number): Observable<Page<ProductResponseSummaryDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<ProductResponseSummaryDTO>>(this.apiUrlUser, {headers, params});
    
  }

  getCategories(page: number, size: number) : Observable<Page<Categories>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<Categories>>(this.apiUrlCategories, {headers, params});
  }

  getStatus() : Observable<Status[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Array<Status>>(this.apiUrlStatus, {headers});
  }

  getProductsByCategory(page: number, size: number, categoryId : number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<ProductResponseSummaryDTO>>(this.apiUrlfindByCategory + categoryId, {headers, params});
  }
  
  getProductsFilter(page: number, size: number, categoryId : number, statusList : number[]): Observable<Page<ProductResponseSummaryDTO>> {
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams()
                          .set('page', page.toString())
                          .set('size', size.toString())
                          .set('categoryId', categoryId)
                          .set('status', statusList.toString())

    return this.http.get<Page<ProductResponseSummaryDTO>>(this.apiUrlFilter, {headers, params});
    
  }

}

export interface Categories {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface ProductResponseSummaryDTO {
  id: number;
  name: string;
  description: string;
  status: string;
  imageUrl: string;
  price: number;
  category: string;
  seller: ResponseUserProductDTO;
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



