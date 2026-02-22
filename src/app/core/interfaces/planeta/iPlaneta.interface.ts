export interface CreatePlanetaDto {
  nombre: string;
  grupo: string;
  resumenCurso: string;
  imagenResumen: string;
  estado: string;
  galaxiaId: string;
  tema: string;  
  textura: string;
  url: string;
  info?: InfoPlaneta;
  peligros: Peligro[];
  beneficios: Beneficio[];
}

export interface IPlanetaDto extends CreatePlanetaDto {
  id: string;
}

export interface InfoPlaneta {
  tipoRiesgo: string;
  tamano: string;
  composicion: string;
  riesgo: string;
  nivel: string;
  ambiente: string;
  temperatura: string;
  villano: string;
}

export interface Peligro {
  nombre: string;
  descripcion: string;
  nivelRiesgo: string;
  temperatura: string;
  villano: string;
  cta: string;
}

export interface Beneficio {
  titulo: string;
  descripcion: string;
}