import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ColaboradorActivo } from '../models/colaboradores-activos.models';

@Injectable({
  providedIn: 'root'
})
export class ColaboradoresActivosService {
  
  private apiUrl = `${environment.apiUrl}/colaboradores-activos`;

  constructor(private http: HttpClient) {}

  // Obtener colaboradores activos con filtro opcional por ID
  getColaboradoresActivos(id?: string): Observable<ColaboradorActivo[]> {
    let params = new HttpParams();
    
    // Si hay un ID, lo agregamos como parámetro
    if (id && id.trim() !== '') {
      params = params.set('id', id);
    }

    return this.http.get<ColaboradorActivo[]>(this.apiUrl, { params });
  }
}