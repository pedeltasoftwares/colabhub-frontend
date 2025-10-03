import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColaboradoresActivosService } from '../../services/colaboradores-activos.service';
import { ColaboradorActivo } from '../../models/colaboradores-activos.models';
import { CatalogosService } from '../../services/catalogos.service';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  
  colaboradores: ColaboradorActivo[] = [];
  filtroId: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  //Catalogos
  catalogos: any = {}

  // Usuario logueado
  currentUser: any = null;

  constructor(
    private colaboradoresService: ColaboradoresActivosService,
    private catalogosService: CatalogosService,
    private storageService: StorageService  
  ) {}

  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    console.log('Usuario actual:', this.currentUser);
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.isLoading = true;
    
    this.catalogosService.getCatalogosSimples().subscribe({
      next: (catalogos) => {
        this.catalogos = catalogos;
        console.log('Catálogos cargados:', catalogos);
        
        // Carga colaboradores
        this.cargarColaboradores();
      },
      error: (err) => {
        this.error = 'Error al cargar catálogos';
        this.isLoading = false;
        console.error('Error catálogos:', err);
      }
    });
  }

  cargarColaboradores() {
    this.colaboradoresService.getColaboradoresActivos(this.filtroId).subscribe({
      next: (response) => {
        console.log('Colaboradores cargados:', response);
        
        // Ordenar alfabéticamente
        this.colaboradores = response.sort((a, b) => {
          const nombreComparacion = a.PrimerNombre.localeCompare(b.PrimerNombre);
          if (nombreComparacion === 0) {
            return a.PrimerApellido.localeCompare(b.PrimerApellido);
          }
          return nombreComparacion;
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar colaboradores';
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }

  buscarPorId() {
    this.isLoading = true;
    this.cargarColaboradores();
  }

  limpiarFiltro() {
    this.filtroId = '';
    this.isLoading = true;
    this.cargarColaboradores();
  }

  // Funciones helper para obtener nombres desde IDs
  getNombreTipoID(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.tipoID?.find((item: any) => item.ID === id);
    return catalogo?.TipoID || id.toString();
  }

  getNombreCargo(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.cargo?.find((item: any) => item.ID === id);
    return catalogo?.NombCargo || id.toString();
  }

  getNombreArea(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.area?.find((item: any) => item.ID === id);
    return catalogo?.NombArea || id.toString();
  }

  getNombreGenero(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.genero?.find((item: any) => item.ID === id);
    return catalogo?.Genero || id.toString();
  }

  getNombreARL(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.arl?.find((item: any) => item.ID === id);
    return catalogo?.NombreARL || id.toString();
  }

  getNombreEPS(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.eps?.find((item: any) => item.ID === id);
    return catalogo?.NombreEPS || id.toString();
  }

  getNombreAFP(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.afp?.find((item: any) => item.ID === id);
    return catalogo?.NombreAFP || id.toString();
  }

  getNombreACCAI(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.accai?.find((item: any) => item.ID === id);
    return catalogo?.NombreACCAI || id.toString();
  }

  getNombreCesantias(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.cesantias?.find((item: any) => item.ID === id);
    return catalogo?.NombreCesantias || id.toString();
  }

  getNombreCajaCompensacion(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.cajaCompensacion?.find((item: any) => item.ID === id);
    return catalogo?.NombreCaja || id.toString();
  }

  getNombreRH(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.rh?.find((item: any) => item.ID === id);
    return catalogo?.NombRH || id.toString();
  }

  getNombreSede(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.sede?.find((item: any) => item.IdMun === id);
    return catalogo?.NombMun || id.toString();
  }

  getNombrePais(iso2: string | null): string {
    if (!iso2) return '-';
    const catalogo = this.catalogos.paises?.find((item: any) => item.ISO2 === iso2);
    return catalogo?.Nombre || iso2;
  }

  getNombrePerfil(id: number | null): string {
    if (!id) return '-';
    const catalogo = this.catalogos.perfil?.find((item: any) => item.ID === id);
    return catalogo?.Perfil || id.toString();
  }

    getNombreEstado(codigoISO: string | null): string {
    if (!codigoISO) return '-';
    const catalogo = this.catalogos.estados?.find((item: any) => item.CodigoISO === codigoISO);
    return catalogo?.Nombre || codigoISO;
  }

  getNombreCiudad(codigoMunicipal: string | null): string {
    if (!codigoMunicipal) return '-';
    const catalogo = this.catalogos.ciudades?.find((item: any) => item.CodigoMunicipalNacional === codigoMunicipal);
    return catalogo?.Nombre || codigoMunicipal;
  }
}