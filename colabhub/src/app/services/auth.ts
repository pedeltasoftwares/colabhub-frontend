import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Ruta del back
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  //Login
  login(username: string, password: string): Observable<any> {

    const body = {username,password};
    return this.http.post(`${this.apiUrl}/login`,body);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
