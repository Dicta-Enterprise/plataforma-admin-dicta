export interface IPlanetaDto {
  id: string;
  nombre: string;
  grupo: string;
  descripcion: string;
  resumenCurso: string;
  imagenResumen: string;
  estado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  galaxiaId: string;
  tema: string;
}