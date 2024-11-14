import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 

export class UserServiceService {

  private url = 'http://localhost:8080';
  private pathRegister = "/user/registrar";
  private pathGetUser = '/user/profile'; 
  private pathUpdateUser = '/user/update'; 
  private pathDeleteUser = '/user/delete'; 
  private pathCheckUsername = '/user/check-username'; // verificar Ya registrado
  private pathCheckEmail = '/user/check-email'; // verificar email ya registrado
  private pathChangePassword = '/user/change-password'

  // Inicializa con el valor actual en localStorage (si existe)
  private userDataSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('userdata') || '{}'));
  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Obtener datos de usuario
  getUsuario(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.url + this.pathGetUser, { headers });
  }

  // Método para actualizar los datos del usuario
  updateUserData(newUserData: any): void {
    this.userDataSubject.next(newUserData);
    localStorage.setItem('userdata', JSON.stringify(newUserData));
  }

  // Editar usuario
  updateUsuario(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(this.url + this.pathUpdateUser, user, { headers });
  }

  // Eliminar usuario
  deleteUsuario(password : string): Observable<any> {
    console.log(password);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Crear el FormData
    const formData = new FormData();
    formData.append('password', password);

    return this.http.post<any>(`${this.url}${this.pathDeleteUser}`, formData, { headers });
  }
  // Verificar si el usuario ya está registrado
  checkUsername(username: string): Observable<any> {
    const params = new HttpParams().set('username', username);
    return this.http.get<any>(`${this.url}${this.pathCheckUsername}`, { params });
  }
  // Verificar si email ya está registrado
  checkEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.url}${this.pathCheckEmail}`, { params });
  }
  
  isAuth(): boolean {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userdata');
    return !!token || !!userData;
  }

  registrarUsuario(user: any): Observable<any> {
    return this.http.post<any>(this.url + this.pathRegister, user);
  }

  logIn(user: any): Observable<any> {
    return this.http.post<any>(this.url + "/auth/login", user).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.updateUserData({'username' : response.username, 'email': response.email, 'tel': response.tel})
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

  formatUserDataLogin(data:any): any {
    data.username = data.username.trim().toLowerCase();
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

   changePassword(passwordData : any) {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type' : 'application/json'
    })
    return this.http.put<any>(`${this.url}${this.pathChangePassword}`, passwordData, { headers });
   }

  
} 
