import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../models/auth.model';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  //Ruta del back
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient,
    private storageService: StorageService
  ) {}

  //Login
  login(username: string, password: string): Observable<LoginResponse> {

    const body = {username,password};
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body).pipe(
      tap(response => {
        // Se guarda automáticamente el token y el usuario
        this.storageService.saveToken(response.access_token);
        this.storageService.saveUser(response.user);
      })
    );
  }

  //Set password
  set_password(username: string, password:string): Observable<any> {

    const body = {username,password};
    return this.http.post(`${this.apiUrl}/set-password`,body);
  }

  logout() {
    this.storageService.clear();
  }

  getUser() {
    return this.storageService.getUser();
  }

  getRole(): string | null {
    return this.storageService.getUserRole();
  }

  getToken() {
    return this.storageService.getToken();
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }
}
