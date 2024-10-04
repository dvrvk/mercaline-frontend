import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private url = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  isAuth(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  registrarUsuario(user: any): Observable<any> {
    return this.http.post<any>(this.url + "/user/registrar", user);
  }

  logIn(user: any): Observable<any> {
    return this.http.post<any>(this.url + "/auth/login", user).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userdata', JSON.stringify({
          username: response.username,
          email: response.email,
          tel: response.tel
        }));
      }))
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userdata');
  }
} 
