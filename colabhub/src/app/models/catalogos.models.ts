// Catálogos simples (estructura estándar)
export interface CatalogoSimple {
  ID: number;
  Nombre: string;
}

export interface CatalogoACCAI extends CatalogoSimple {
    NombreACCAI: string;
}

export interface CatalogoAFP extends CatalogoSimple {
    NombreAFP: string;
}

export interface CatalogoArea extends CatalogoSimple {
    NombArea: string;
}

export interface CatalogoARL extends CatalogoSimple {
    NombreARL: string;
}

export interface CatalogoCajaCompensacion extends CatalogoSimple {
    NombreCaja: string;
}

export interface CatalogoCargo extends CatalogoSimple {
    NombCargo: string;
}

export interface CatalogoCesantias extends CatalogoSimple {
    NombreCesantias: string;
}

export interface CatalogoEPS extends CatalogoSimple {
    NombreEPS: string;
}

export interface CatalogoMotivoRetiro extends CatalogoSimple {
    Motivo: string;
}

export interface CatalogoGenero extends CatalogoSimple {
    Genero: string;
}

export interface CatalogoRH extends CatalogoSimple {
    NombRH: string;
}

export interface CatalogoSede extends CatalogoSimple {
    IdMun: number;
    NombMun: string;
}

export interface CatalogoTipoIDColaborador extends CatalogoSimple {
    TipoID: string;
}

export interface CatalogoPerfil extends CatalogoSimple {
    Perfil: string;
}

// Catálogos geográficos (estructura especial)
export interface Pais {
  IDPais: number;
  Nombre: string;
  ISO2: string;
}

export interface Estado {
  ISO2: string;
  CodigoISO: string;
  Nombre: string;
  CodigoNacional: string;
  ISO3166_2: string;
}

export interface Ciudad {
  ISO2: string;
  CodigoISOEstado: string;
  CodigoMunicipalNacional: string;
  Nombre: string;
  ISO3166_2_Estado: string;
}