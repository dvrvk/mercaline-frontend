import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private url = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  registrarUsuario(user: any): Observable<any> {
    return this.http.post<any>(this.url + "/user/registrar", user);
  }

  logearUsuario(user: any): Observable<any> {
    return this.http.post<any>(this.url + "/auth/login", user).pipe(
      tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userdata', JSON.stringify({
            username: response.username,
            email: response.email,
            tel: response.tel
          }))
      }))
  }

  logout() : void {
    localStorage.removeItem('token');
    localStorage.removeItem('userdata');
  }
} 
