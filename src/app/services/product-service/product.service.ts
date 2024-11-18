import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private apiUrlCategories = 'http://localhost:8080/products/categories';
  private apiUrlStatus = 'http://localhost:8080/products/status';
  private apiUrlUser = 'http://localhost:8080/user/products'
  private apiUrlfindByCategory = `http://localhost:8080/products/category/`;
  private apiUrlFilter = 'http://localhost:8080/products/filter2';
  private apiUrlUpload = 'http://localhost:8080/products/create';
  private apiUrlImageMain = 'http://localhost:8080/images/main/'
  private apiUrlImages = 'http://localhost:8080/images'
  private apiUrlProductDetails = 'http://localhost:8080/products/';

  constructor(private http: HttpClient) { }

  getProduct(page: number, size: number): Observable<Page<ProductResponseSummaryDTO>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<ProductResponseSummaryDTO>>(this.apiUrlUser, { headers, params });

  }

  getCategories(page: number | null, size: number | null): Observable<Page<Categories>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (page != null && size != null) {
      const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
      return this.http.get<Page<Categories>>(this.apiUrlCategories, { headers, params });
    } else {
      return this.http.get<Page<Categories>>(this.apiUrlCategories, { headers })
    }

  }

  getStatus(): Observable<Status[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Array<Status>>(this.apiUrlStatus, { headers });
  }

  getProductsByCategory(page: number, size: number, categoryId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<Page<ProductResponseSummaryDTO>>(this.apiUrlfindByCategory + categoryId, { headers, params });
  }

  getProductsFilter(page: number, size: number, categoryId: number, filter: FilterClass | null, order: string | null): Observable<Page<ProductResponseSummaryDTO>> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('categoryId', categoryId)
    if (filter !== null) {
      params = params.set('status', filter.statusFilter.toString())

      if (filter.minPrice !== null) {
        params = params.set('minPrice', filter.minPrice)
      }

      if (filter.maxPrice !== null) {
        params = params.set('maxPrice', filter.maxPrice.toString())
      }
    }

    if (order !== null) {
      params = params.set('sort', order);
    }

    return this.http.get<Page<ProductResponseSummaryDTO>>(this.apiUrlFilter, { headers, params });

  }

  uploadProduct(product: FormData) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrlUpload, product, { headers });
  }

  getProductImage(id: number): Observable<Blob | URL> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrlImageMain + id, { headers, responseType: 'blob' })
  }

  getProductImages(productId: number) : Observable<ApiResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<ApiResponse>(`${this.apiUrlImages}/${productId}`, {headers});
  }

  getProductDetails(productId : number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrlProductDetails}${productId}`, {headers})
  }

}

export interface ApiResponse { 
  status: string; 
  fecha: string; 
  mensaje: string; 
}

export interface FilterClass {
  statusFilter: number[],
  maxPrice: number | null,
  minPrice: number | null
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
  id: number,
  name: string,
  description: string,
  status: string,
  //imageUrl: string;
  imageUrl: SafeUrl | string,
  price: number,
  category: string,
  seller: ResponseUserProductDTO
}

export interface ResponseUserProductDTO {
  id: number;
  username: string;
}

export interface ProductRequestDTO {
  name: string;
  description: string;
  status: number;
  imageUrl: File;
  price: number;
  category: number;
  seller: ResponseUserProductDTO;
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



