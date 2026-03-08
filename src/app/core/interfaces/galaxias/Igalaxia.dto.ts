export interface CreateGalaxiaDto {
  nombre: string;
  descripcion: string;
  color: string;
  estado: boolean;
  categoria:string;
  categoriaId: string;

  tema: string;
  imagen: string;
  url: string;
  textura: string;

  posicion: Posicion;
  rotacion: Rotacion;
}

export interface IGalaxiaDto extends CreateGalaxiaDto {
  id: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Posicion {
  x: number;
  y: number;
  z: number;
}

export interface Rotacion {
  x: number;
  y: number;
  z: number;
}

export interface CreateMultipleGalaxiasDto {
  nombreGlobal: string;
  descripcionGlobal: string;
  galaxias: CreateGalaxiaDto[];
}