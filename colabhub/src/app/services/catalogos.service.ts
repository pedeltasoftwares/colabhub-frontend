import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import {map} from 'rxjs'
import { environment } from '../../environments/environment';
import {
  CatalogoACCAI,
  CatalogoAFP,
  CatalogoArea,
  CatalogoARL,
  CatalogoCajaCompensacion,
  CatalogoCargo,
  CatalogoCesantias,
  CatalogoEPS,
  CatalogoGenero,
  CatalogoRH,
  CatalogoSede,
  CatalogoTipoIDColaborador,
  CatalogoPerfil,
  Pais,
  Estado,
  Ciudad
} from '../models/catalogos.models'

@Injectable({
  providedIn: 'root'
})


export class CatalogosService  {

  private apiUrl = `${environment.apiUrl}/catalogs`;

  constructor(private http: HttpClient){}

  //Obtener todos los catálogos necesarios de una vez
  getCatalogosSimples(): Observable<any> {
    return forkJoin({
      accai: this.http.get<CatalogoACCAI[]>(`${this.apiUrl}/ACCAI`),
      afp: this.http.get<CatalogoAFP[]>(`${this.apiUrl}/AFP`),
      area: this.http.get<CatalogoArea[]>(`${this.apiUrl}/Area`),
      arl: this.http.get<CatalogoARL[]>(`${this.apiUrl}/ARL`),
      cajaCompensacion: this.http.get<CatalogoCajaCompensacion[]>(`${this.apiUrl}/CajaCompensacion`),
      cargo: this.http.get<CatalogoCargo[]>(`${this.apiUrl}/Cargo`),
      cesantias: this.http.get<CatalogoCesantias[]>(`${this.apiUrl}/Cesantias`),
      eps: this.http.get<CatalogoEPS[]>(`${this.apiUrl}/EPS`),
      genero: this.http.get<CatalogoGenero[]>(`${this.apiUrl}/Genero`),
      rh: this.http.get<CatalogoRH[]>(`${this.apiUrl}/RH`),
      sede: this.http.get<CatalogoSede[]>(`${this.apiUrl}/Sede`),
      tipoID: this.http.get<CatalogoTipoIDColaborador[]>(`${this.apiUrl}/TipoIDColaborador`),
      perfil: this.http.get<CatalogoPerfil[]>(`${this.apiUrl}/PerfilesCargos`),
      paises: this.http.get<Pais[]>(`${this.apiUrl}/Paises`),
      estados: this.http.get<Estado[]>(`${this.apiUrl}/Estados`),     
      ciudades: this.http.get<Ciudad[]>(`${this.apiUrl}/Ciudades`) 
    })
  }

  getEstados(filtroPais?: string): Observable<Estado[]> {
    let params = new HttpParams();
    if (filtroPais) {
      params = params.set('filtro', filtroPais);
    }
    return this.http.get<Estado[]>(`${this.apiUrl}/Estados`, { params });
  }

  getCiudades(filtroEstado?: string): Observable<Ciudad[]> {
    let params = new HttpParams();
    if (filtroEstado) {
      params = params.set('filtro', filtroEstado);
    }
    return this.http.get<Ciudad[]>(`${this.apiUrl}/Ciudades`, { params });
  }

}
