export interface ColaboradorRetirado {
  ID: number;
  TipoID: number;
  PrimerNombre: string;
  SegundoNombre: string | null;
  PrimerApellido: string;
  SegundoApellido: string | null;
  FechaIngreso: string;
  Cargo: number;
  Area: number;
  FechaNacimiento: string;
  Edad: number;
  Genero: number;
  DireccionResidencia: string;
  ARL: number;
  EPS: number;
  AFP: number;
  ACCAI: number;
  Cesantias: number;
  CajaCompensacion: number;
  Celular: string;
  RH: number;
  IdSede: number;
  FechaRetiro: string;
  MotivoRetiro: number;
}