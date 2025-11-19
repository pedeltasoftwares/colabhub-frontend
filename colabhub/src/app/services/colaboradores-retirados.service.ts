import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ColaboradorRetirado } from '../models/colaboradores-retirados.models';

@Injectable({
  providedIn: 'root'
})
export class ColaboradoresRetiradosService {
  
  private apiUrl = `${environment.apiUrl}/colaboradores-retirados`;

  constructor(private http: HttpClient) {}

  // Obtener colaboradores retirados
  getColaboradoresRetirados(): Observable<ColaboradorRetirado[]> {
    return this.http.get<ColaboradorRetirado[]>(this.apiUrl);
  }


}