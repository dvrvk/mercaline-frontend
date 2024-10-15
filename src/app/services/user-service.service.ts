import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 

export class UserServiceService {

  private url = 'http://localhost:8080';
  private pathRegister = "/user/registrar";

  constructor(private http: HttpClient) { }

  isAuth(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  registrarUsuario(user: any): Observable<any> {
    return this.http.post<any>(this.url + this.pathRegister, user);
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

  formatUserDataRegister(data:any): any {
    data.username = data.username.trim().toLowerCase();
    data.name = this.formatName(data.name);
    data.lastname = this.formatName(data.lastname);
    data.email = data.email.trim().toLowerCase();
    data.tel = data.tel.trim();

    return data;
  }

  private formatName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  

  
} 
