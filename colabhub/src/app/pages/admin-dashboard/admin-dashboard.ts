import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColaboradoresActivosService } from '../../services/colaboradores-activos.service';
import { ColaboradorActivo } from '../../models/colaboradores-activos.models';
import { CatalogosService } from '../../services/catalogos.service';
import { StorageService } from '../../services/storage';
import * as XLSX from 'xlsx'; //

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
  modoSeleccion: boolean = false;
  colaboradoresSeleccionados: Map<number, ColaboradorActivo> = new Map();

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

  //Mostrar modal de edición de colaborador
  mostrarModalEditar: boolean = false;
  colaboradorEditando: any = {}
  idOriginalEditando: number = 0;
  

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

         const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
          modalBody.scrollTop = 0;
        }

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

  toggleModoSeleccion() {
    if (this.modoSeleccion && this.colaboradoresSeleccionados.size > 0) {
      this.exportarAExcel();
    } else {
      this.modoSeleccion = !this.modoSeleccion;
      if (!this.modoSeleccion) {
        this.colaboradoresSeleccionados.clear();
      }
    }
  }

  toggleSeleccion(id: number) {
    if (this.colaboradoresSeleccionados.has(id)) {
      this.colaboradoresSeleccionados.delete(id);
    } else {
      // Guardar el objeto completo
      const colaborador = this.colaboradores.find(col => col.ID === id);
      if (colaborador) {
        this.colaboradoresSeleccionados.set(id, colaborador);
      }
    }
  }

  toggleTodos(event: any) {
    if (event.target.checked) {
      // Seleccionar todos los visibles
      this.colaboradores.forEach(col => {
        this.colaboradoresSeleccionados.set(col.ID, col);
      });
    } else {
      // Deseleccionar solo los visibles
      this.colaboradores.forEach(col => {
        this.colaboradoresSeleccionados.delete(col.ID);
      });
    }
  }

  todosSeleccionados(): boolean {
    return this.colaboradores.length > 0 && 
           this.colaboradores.every(col => this.colaboradoresSeleccionados.has(col.ID));
  }

  limpiarSeleccion() {
    this.colaboradoresSeleccionados.clear();
  }

  getColaboradoresSeleccionadosVisibles(): number {
    return this.colaboradores.filter(col => 
      this.colaboradoresSeleccionados.has(col.ID)
    ).length;
  }

  exportarAExcel() {
    if (this.colaboradoresSeleccionados.size === 0) {
      alert('Por favor seleccione al menos un colaborador para exportar');
      return;
    }

    // ✅ CAMBIO CLAVE: Usar Array.from para obtener los valores del Map
    const colaboradoresAExportar = Array.from(this.colaboradoresSeleccionados.values());

    // Preparar datos para Excel con nombres legibles
    const datosExcel = colaboradoresAExportar.map(col => ({
      'ID': col.ID,
      'Tipo ID': this.getNombreTipoID(col.TipoID),
      'Primer Nombre': col.PrimerNombre,
      'Segundo Nombre': col.SegundoNombre || '',
      'Primer Apellido': col.PrimerApellido,
      'Segundo Apellido': col.SegundoApellido || '',
      'Email': col.Email,
      'Fecha Ingreso': col.FechaIngreso,
      'Cargo': this.getNombreCargo(col.Cargo),
      'Área': this.getNombreArea(col.Area),
      'Perfil': this.getNombrePerfil(col.Perfil),
      'Sede': this.getNombreSede(col.IdSede),
      'Último Examen': col.UltimoExamenOcupacional || '',
      'Fecha Nacimiento': col.FechaNacimiento,
      'Edad': col.Edad,
      'Género': this.getNombreGenero(col.Genero),
      'País Nacimiento': this.getNombrePais(col.IDPaisNac),
      'Estado Nacimiento': this.getNombreEstado(col.IDEstadoNac),
      'Ciudad Nacimiento': this.getNombreCiudad(col.IDCiudadNac),
      'Dirección': col.DireccionResidencia,
      'ARL': this.getNombreARL(col.ARL),
      'EPS': this.getNombreEPS(col.EPS),
      'AFP': this.getNombreAFP(col.AFP),
      'ACCAI': this.getNombreACCAI(col.ACCAI),
      'Cesantías': this.getNombreCesantias(col.Cesantias),
      'Caja Compensación': this.getNombreCajaCompensacion(col.CajaCompensacion),
      'Celular': col.Celular || '',
      'RH': this.getNombreRH(col.RH),
      'Contacto Emergencia': col.ContactoEmergencia || '',
      'Celular Contacto': col.CelularContactoEmergencia || ''
    }));

    // Crear libro de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');

    // Generar nombre del archivo con fecha
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Colaboradores_${fecha}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, nombreArchivo);

    // Limpiar selección y salir del modo selección
    this.colaboradoresSeleccionados.clear();
    this.modoSeleccion = false;

    alert(`Reporte generado exitosamente: ${colaboradoresAExportar.length} colaboradores exportados`);
  }

  abrirModalEditar(colaborador: ColaboradorActivo){

    this.mostrarModalEditar = true;
    this.idOriginalEditando = colaborador.ID

    // Clonar el objeto para no modificar el original hasta guardar
    this.colaboradorEditando = {
      ID: colaborador.ID,
      TipoID: colaborador.TipoID,
      PrimerNombre: colaborador.PrimerNombre,
      SegundoNombre: colaborador.SegundoNombre || '',
      PrimerApellido: colaborador.PrimerApellido,
      SegundoApellido: colaborador.SegundoApellido || '',
      Email: colaborador.Email,
      FechaIngreso: colaborador.FechaIngreso,
      Cargo: colaborador.Cargo,
      Area: colaborador.Area,
      Perfil: colaborador.Perfil,
      IdSede: colaborador.IdSede,
      UltimoExamenOcupacional: colaborador.UltimoExamenOcupacional || '',
      FechaNacimiento: colaborador.FechaNacimiento,
      Edad: colaborador.Edad,
      Genero: colaborador.Genero,
      IDPaisNac: colaborador.IDPaisNac,
      IDEstadoNac: colaborador.IDEstadoNac,
      IDCiudadNac: colaborador.IDCiudadNac,
      DireccionResidencia: colaborador.DireccionResidencia,
      ARL: colaborador.ARL,
      EPS: colaborador.EPS,
      AFP: colaborador.AFP,
      ACCAI: colaborador.ACCAI,
      Cesantias: colaborador.Cesantias,
      CajaCompensacion: colaborador.CajaCompensacion,
      Celular: colaborador.Celular || '',
      RH: colaborador.RH,
      ContactoEmergencia: colaborador.ContactoEmergencia || '',
      CelularContactoEmergencia: colaborador.CelularContactoEmergencia || ''
    };

    // Cargar estados y ciudades según el país seleccionado
    if (this.colaboradorEditando.IDPaisNac) {
      this.estadosFiltrados = this.catalogos.estados?.filter(
        (estado: any) => estado.ISO2 === this.colaboradorEditando.IDPaisNac
      ) || [];
      
      console.log('Estados filtrados:', this.estadosFiltrados);
      console.log('Estado del colaborador:', this.colaboradorEditando.IDEstadoNac);
    }

    // Luego cargar las ciudades del estado
    if (this.colaboradorEditando.IDEstadoNac) {
      this.ciudadesFiltradas = this.catalogos.ciudades?.filter(
        (ciudad: any) => ciudad.CodigoISOEstado === this.colaboradorEditando.IDEstadoNac
      ) || [];
      
      console.log('Ciudades filtradas:', this.ciudadesFiltradas);
      console.log('Ciudad del colaborador:', this.colaboradorEditando.IDCiudadNac);
    }

  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.colaboradorEditando = {};
    this.idOriginalEditando = 0;
    this.errorModal = null;
    this.mensajeExito = null;
    this.estadosFiltrados = [];
    this.ciudadesFiltradas = [];
  }

  onEstadoChangeEditar() {
    if (this.colaboradorEditando.IDEstadoNac) {
      this.ciudadesFiltradas = this.catalogos.ciudades?.filter(
        (ciudad: any) => ciudad.CodigoISOEstado === this.colaboradorEditando.IDEstadoNac
      ) || [];
    } else {
      this.ciudadesFiltradas = [];
    }
  }

  calcularEdadEditar() {
    if (!this.colaboradorEditando.FechaNacimiento) {
      this.colaboradorEditando.Edad = null;
      return;
    }

    const fechaNacimiento = new Date(this.colaboradorEditando.FechaNacimiento);
    const hoy = new Date();
    
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    
    this.colaboradorEditando.Edad = edad;
  }

  actualizarColaborador() { 

    // SOLO validar formatos (no campos obligatorios)
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

    // Preparar datos para enviar (enviar todos los campos)
    const body = {
      PrimerNombre: this.colaboradorEditando.PrimerNombre || null,
      SegundoNombre: this.colaboradorEditando.SegundoNombre || null,
      PrimerApellido: this.colaboradorEditando.PrimerApellido || null,
      SegundoApellido: this.colaboradorEditando.SegundoApellido || null,
      Email: this.colaboradorEditando.Email || null,
      FechaNacimiento: this.colaboradorEditando.FechaNacimiento || null,
      Genero: this.colaboradorEditando.Genero ? Number(this.colaboradorEditando.Genero) : null,
      IDPaisNac: this.colaboradorEditando.IDPaisNac || null,
      IDEstadoNac: this.colaboradorEditando.IDEstadoNac || null,
      IDCiudadNac: this.colaboradorEditando.IDCiudadNac || null,
      DireccionResidencia: this.colaboradorEditando.DireccionResidencia || null,
      FechaIngreso: this.colaboradorEditando.FechaIngreso || null,
      Cargo: this.colaboradorEditando.Cargo ? Number(this.colaboradorEditando.Cargo) : null,
      Area: this.colaboradorEditando.Area ? Number(this.colaboradorEditando.Area) : null,
      Perfil: this.colaboradorEditando.Perfil ? Number(this.colaboradorEditando.Perfil) : null,
      IdSede: this.colaboradorEditando.IdSede ? Number(this.colaboradorEditando.IdSede) : null,
      UltimoExamenOcupacional: this.colaboradorEditando.UltimoExamenOcupacional || null,
      ARL: this.colaboradorEditando.ARL ? Number(this.colaboradorEditando.ARL) : null,
      EPS: this.colaboradorEditando.EPS ? Number(this.colaboradorEditando.EPS) : null,
      AFP: this.colaboradorEditando.AFP ? Number(this.colaboradorEditando.AFP) : null,
      ACCAI: this.colaboradorEditando.ACCAI ? Number(this.colaboradorEditando.ACCAI) : null,
      Cesantias: this.colaboradorEditando.Cesantias ? Number(this.colaboradorEditando.Cesantias) : null,
      CajaCompensacion: this.colaboradorEditando.CajaCompensacion ? Number(this.colaboradorEditando.CajaCompensacion) : null,
      Celular: this.colaboradorEditando.Celular || null,
      RH: this.colaboradorEditando.RH ? Number(this.colaboradorEditando.RH) : null,
      ContactoEmergencia: this.colaboradorEditando.ContactoEmergencia || null,
      CelularContactoEmergencia: this.colaboradorEditando.CelularContactoEmergencia || null
    };

    console.log('Actualizando colaborador:', body);

    this.isLoading = true;
    this.errorModal = null;
    this.mensajeExito = null;

    this.colaboradoresService.actualizarColaborador(this.idOriginalEditando, body).subscribe({
      next: (response) => {
        console.log('Colaborador actualizado exitosamente:', response);
        this.isLoading = false;
        this.mensajeExito = response.message || 'Colaborador actualizado exitosamente';
        this.cdr.detectChanges();

        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
          modalBody.scrollTop = 0;
        }

        setTimeout(() => {
          this.cerrarModalEditar();
          this.cargarColaboradores();
        }, 2000);
      },
      error: (err) => {
        console.error('Error al actualizar colaborador:', err);
        this.isLoading = false;
        
        if (err.error && err.error.message) {
          this.errorModal = err.error.message;
        } else {
          this.errorModal = 'Error al actualizar el colaborador. Por favor intente nuevamente.';
        }
        
        this.cdr.detectChanges();
        
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
      }
      });
  }

  onCambioPaisManualEditar() {
  // Limpiar dependencias solo si cambia manualmente
  this.colaboradorEditando.IDEstadoNac = '';
  this.colaboradorEditando.IDCiudadNac = '';
  this.ciudadesFiltradas = [];
  
  // Cargar estados del nuevo país
  if (this.colaboradorEditando.IDPaisNac) {
    this.estadosFiltrados = this.catalogos.estados?.filter(
      (estado: any) => estado.ISO2 === this.colaboradorEditando.IDPaisNac
    ) || [];
  } else {
    this.estadosFiltrados = [];
  }
}

onCambioEstadoManualEditar() {
  // Limpiar ciudad solo si cambia manualmente
  this.colaboradorEditando.IDCiudadNac = '';
  
  // Cargar ciudades del nuevo estado
  if (this.colaboradorEditando.IDEstadoNac) {
    this.ciudadesFiltradas = this.catalogos.ciudades?.filter(
      (ciudad: any) => ciudad.CodigoISOEstado === this.colaboradorEditando.IDEstadoNac
    ) || [];
  } else {
    this.ciudadesFiltradas = [];
  }
}

}

