import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
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
  tipoBusqueda: string = 'id'; 
  valorBusqueda: string = ''; 
  isLoading: boolean = false;
  error: string | null = null;  
  errorModal: string | null = null;  
  mensajeExito: string | null = null; 

  //Catalogos
  catalogos: any = {}

  // Usuario logueado
  currentUser: any = null;

  //Modal nuevo colaborador
  mostrarModal: boolean = false;
  nuevoColaborador: any = {};

  // Listas filtradas para cascada
  estadosFiltrados: any[] = [];
  ciudadesFiltradas: any[] = [];
  

  constructor(
    private colaboradoresService: ColaboradoresActivosService,
    private catalogosService: CatalogosService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef 
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
    // Determinar qué parámetros enviar según el tipo de búsqueda
    const id = this.tipoBusqueda === 'id' ? this.valorBusqueda : undefined;
    const nombre = this.tipoBusqueda === 'nombre' ? this.valorBusqueda : undefined;
    
    this.colaboradoresService.getColaboradoresActivos(id, nombre).subscribe({
      next: (response) => {
        console.log('Colaboradores cargados:', response);
        
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

  buscar() {
    this.isLoading = true;
    this.cargarColaboradores();
  }

  limpiarFiltro() {
    this.valorBusqueda = '';
    this.tipoBusqueda = 'id';
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

  abrirFormularioNuevoColaborador() {
    this.mostrarModal = true;
    this.nuevoColaborador = {
      ID: '',
      TipoID: null,  // MANTENER null
      PrimerNombre: '',
      SegundoNombre: '',
      PrimerApellido: '',
      SegundoApellido: '',
      Email: '',
      FechaIngreso: '',
      Cargo: null,  // MANTENER null
      Area: null,
      Perfil: null,
      IdSede: null,
      UltimoExamenOcupacional: '',
      FechaNacimiento: '',
      Edad: null,
      Genero: null,
      IDPaisNac: '',
      IDEstadoNac: '',
      IDCiudadNac: '',
      DireccionResidencia: '',
      ARL: null,
      EPS: null,
      AFP: null,
      ACCAI: null,
      Cesantias: null,
      CajaCompensacion: null,
      Celular: '',
      RH: null,
      ContactoEmergencia: '',
      CelularContactoEmergencia: ''
    };
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoColaborador = {};
    this.errorModal = null; 
    this.mensajeExito = null;
    this.estadosFiltrados = [];
    this.ciudadesFiltradas = [];
  }

  validarFormato(): string | null {

    // Validar ID - solo números
    const regexNumeros = /^\d+$/;
    if (this.nuevoColaborador.ID && !regexNumeros.test(this.nuevoColaborador.ID)) {
      return 'El ID debe contener solo números';
    }

    // Validar nombres y apellidos - solo letras y espacios
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    
    if (this.nuevoColaborador.PrimerNombre && !regexLetras.test(this.nuevoColaborador.PrimerNombre)) {
      return 'El Primer Nombre debe contener solo letras';
    }
    
    if (this.nuevoColaborador.SegundoNombre && !regexLetras.test(this.nuevoColaborador.SegundoNombre)) {
      return 'El Segundo Nombre debe contener solo letras';
    }
    
    if (this.nuevoColaborador.PrimerApellido && !regexLetras.test(this.nuevoColaborador.PrimerApellido)) {
      return 'El Primer Apellido debe contener solo letras';
    }
    
    if (this.nuevoColaborador.SegundoApellido && !regexLetras.test(this.nuevoColaborador.SegundoApellido)) {
      return 'El Segundo Apellido debe contener solo letras';
    }

    // Validar Email
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.nuevoColaborador.Email && !regexEmail.test(this.nuevoColaborador.Email)) {
      return 'El Email no tiene un formato válido';
    }

    if (this.nuevoColaborador.ContactoEmergencia && !regexLetras.test(this.nuevoColaborador.ContactoEmergencia)) {
      return 'El contacto de emergencia debe contener solo letras';
    }

    // Validar Celular - solo números
    if (this.nuevoColaborador.Celular && !regexNumeros.test(this.nuevoColaborador.Celular)) {
      return 'El Celular debe contener solo números';
    }

    // Validar Celular Contacto Emergencia - solo números
    if (this.nuevoColaborador.CelularContactoEmergencia && 
        !regexNumeros.test(this.nuevoColaborador.CelularContactoEmergencia)) {
      return 'El Celular de Contacto de Emergencia debe contener solo números';
    }

    return null; // Todo válido
  }

  guardarColaborador() {

    // PRIMERO: Validar formatos
    const errorFormato = this.validarFormato();
    if (errorFormato) {
      this.errorModal = errorFormato;
      this.cdr.detectChanges();
      
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
      
      return;
    }

    // Validar campos obligatorios
    const camposObligatorios = [
      { campo: 'ID', nombre: 'ID' },
      { campo: 'TipoID', nombre: 'Tipo ID' },
      { campo: 'PrimerNombre', nombre: 'Primer Nombre' },
      { campo: 'PrimerApellido', nombre: 'Primer Apellido' },
      { campo: 'Email', nombre: 'Email' },
      { campo: 'FechaNacimiento', nombre: 'Fecha de Nacimiento' },
      { campo: 'Genero', nombre: 'Género' },
      { campo: 'RH', nombre: 'RH' },
      { campo: 'IDPaisNac', nombre: 'País de Nacimiento' },
      { campo: 'IDEstadoNac', nombre: 'Estado/Departamento de Nacimiento' },
      { campo: 'IDCiudadNac', nombre: 'Ciudad de Nacimiento' },
      { campo: 'DireccionResidencia', nombre: 'Dirección de Residencia' },
      { campo: 'FechaIngreso', nombre: 'Fecha de Ingreso' },
      { campo: 'Cargo', nombre: 'Cargo' },
      { campo: 'Area', nombre: 'Área' },
      { campo: 'IdSede', nombre: 'Sede' },
      { campo: 'ARL', nombre: 'ARL' },
      { campo: 'EPS', nombre: 'EPS' },
      { campo: 'AFP', nombre: 'AFP' },
      { campo: 'Cesantias', nombre: 'Cesantías' },
      { campo: 'CajaCompensacion', nombre: 'Caja de Compensación' }
    ];

    // Verificar si hay campos vacíos
    const camposVacios = camposObligatorios.filter(item => 
      this.nuevoColaborador[item.campo] === null || 
      this.nuevoColaborador[item.campo] === '' || 
      this.nuevoColaborador[item.campo] === undefined
    );

    if (camposVacios.length > 0) {
      const listaCampos = camposVacios.map(item => item.nombre).join(', ');
      this.errorModal = `Por favor complete los siguientes campos obligatorios: ${listaCampos}`;
      this.cdr.detectChanges(); 
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
      return;
    }

    //Se preparan los datos para enviarlos al backend
    const body = {

      TipoID: Number(this.nuevoColaborador.TipoID),
      ID: Number(this.nuevoColaborador.ID),
      PrimerNombre: this.nuevoColaborador.PrimerNombre,
      SegundoNombre: this.nuevoColaborador.SegundoNombre || null,
      PrimerApellido: this.nuevoColaborador.PrimerApellido,
      SegundoApellido: this.nuevoColaborador.SegundoApellido || null,
      Email: this.nuevoColaborador.Email,
      FechaNacimiento: this.nuevoColaborador.FechaNacimiento,
      Genero: Number(this.nuevoColaborador.Genero),
      IDPaisNac: this.nuevoColaborador.IDPaisNac,
      IDEstadoNac: this.nuevoColaborador.IDEstadoNac,
      IDCiudadNac: this.nuevoColaborador.IDCiudadNac,
      DireccionResidencia: this.nuevoColaborador.DireccionResidencia,
      FechaIngreso: this.nuevoColaborador.FechaIngreso,
      Cargo: Number(this.nuevoColaborador.Cargo),
      Area: Number(this.nuevoColaborador.Area),
      Perfil: Number(this.nuevoColaborador.Perfil) || null,
      IdSede: Number(this.nuevoColaborador.IdSede),
      UltimoExamenOcupacional: this.nuevoColaborador.UltimoExamenOcupacional || null,
      ARL: Number(this.nuevoColaborador.ARL),
      EPS: Number(this.nuevoColaborador.EPS),
      AFP: Number(this.nuevoColaborador.AFP),
      ACCAI: Number(this.nuevoColaborador.ACCAI) || null,
      Cesantias: Number(this.nuevoColaborador.Cesantias),
      CajaCompensacion: Number(this.nuevoColaborador.CajaCompensacion),
      Celular: this.nuevoColaborador.Celular || null,
      RH: Number(this.nuevoColaborador.RH),
      ContactoEmergencia: this.nuevoColaborador.ContactoEmergencia || null,
      CelularContactoEmergencia: this.nuevoColaborador.CelularContactoEmergencia || null
    }

    console.log('Información del colaborador enviada al back:',body)

    //Se envian los datos al backend
    this.isLoading = true;
    this.errorModal = null;
    this.mensajeExito = null;
    this.colaboradoresService.crearColaborador(body).subscribe({
      next: (response) => {
        console.log('Colaborador creado exitosamente:', response);
        this.isLoading = false;
        //Mostrar mensaje del back
        this.mensajeExito = response.message || 'Colaborador guardado exitosamente';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.cerrarModal();
          this.cargarColaboradores(); 
        }, 2000);
      },
      error: (err) => {
        console.error('Error al crear colaborador:', err);
        this.isLoading = false;
        
        // Capturar el mensaje de error del backend
        if (err.error && err.error.message) {
          this.errorModal = err.error.message;
        } else {
          this.errorModal = 'Error al guardar el colaborador. Por favor intente nuevamente.';
        }
        
        this.cdr.detectChanges();
        
        // Scroll al inicio del modal para ver el error
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
      }
    });
  }

  onPaisChange() {

    // Limpiar selecciones dependientes
    this.nuevoColaborador.IDEstadoNac = '';
    this.nuevoColaborador.IDCiudadNac = '';
    this.ciudadesFiltradas = [];
    
    // Filtrar estados por país seleccionado
    if (this.nuevoColaborador.IDPaisNac) {
      this.estadosFiltrados = this.catalogos.estados?.filter(
        (estado: any) => estado.ISO2 === this.nuevoColaborador.IDPaisNac
      ) || [];
    } else {
      this.estadosFiltrados = [];
    }
  }

  onEstadoChange() {
    // Limpiar selección dependiente
    this.nuevoColaborador.IDCiudadNac = '';
    
    // Filtrar ciudades por estado seleccionado
    if (this.nuevoColaborador.IDEstadoNac) {
      this.ciudadesFiltradas = this.catalogos.ciudades?.filter(
        (ciudad: any) => ciudad.CodigoISOEstado === this.nuevoColaborador.IDEstadoNac
      ) || [];
      
      console.log('Estado seleccionado:', this.nuevoColaborador.IDEstadoNac);
      console.log('Ciudades filtradas:', this.ciudadesFiltradas);
    } else {
      this.ciudadesFiltradas = [];
    }
  }

  calcularEdad() {
    if (!this.nuevoColaborador.FechaNacimiento) {
      this.nuevoColaborador.Edad = null;
      return;
    }

    const fechaNacimiento = new Date(this.nuevoColaborador.FechaNacimiento);
    const hoy = new Date();
    
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    // Si aún no ha cumplido años este año, restar 1
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    
    this.nuevoColaborador.Edad = edad;
  }

}