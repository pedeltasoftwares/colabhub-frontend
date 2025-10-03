import { Injectable } from '@angular/core';
import { User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})


export class StorageService {

  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user_data';

  constructor() { }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Guardar token
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtener usuario
  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Guardar usuario
  saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Obtener rol del usuario
  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // Limpiar todo (para logout)
  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Verificar si hay sesión activa
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  
}
