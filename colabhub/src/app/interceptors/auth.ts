import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const storageService = inject(StorageService);
  const router = inject(Router);
  const token = storageService.getToken();

  // Si existe token, lo agrega al header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest).pipe(
      catchError((error)=>{
        if (error.status === 401) {
          console.warn('Token inválido o expirado. Redirigiendo al login...');
          
          // Limpia el storage
          storageService.clear();
          
          // Redirige al login
          router.navigate(['/login']);
        }
        // Propaga el error
        return throwError(() => error);
      })
    );
  }

  // Si no hay token, deja pasar la petición sin modificar
  return next(req);
};