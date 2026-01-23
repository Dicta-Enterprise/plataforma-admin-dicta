import { IPlanetaDto } from '@interfaces/planeta/iPlaneta.interface';

export class Planeta {
  id: string;
  nombre: string;
  grupo: string;
  descripcion: string;
  resumenCurso: string;
  imagen: string;
  estado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  galaxiaId: string;
  galaxia: string;
  tema: string;

  constructor(planeta: Partial<Planeta> = {}) {
    this.id = planeta.id ?? '';
    this.nombre = planeta.nombre ?? '';
    this.grupo = planeta.grupo ?? '';
    this.descripcion = planeta.descripcion ?? '';
    this.resumenCurso = planeta.resumenCurso ?? '';
    this.imagen = planeta.imagen ?? '';
    this.estado = planeta.estado ?? true;
    this.fechaCreacion = planeta.fechaCreacion ?? new Date();
    this.fechaActualizacion = planeta.fechaActualizacion ?? new Date();
    this.galaxiaId = planeta.galaxiaId ?? '';
    this.galaxia = planeta.galaxia ?? '';
    this.tema = planeta.tema ?? '';
  }

  static fromJson(planeta: unknown): Planeta {
    const casted = planeta as Record<string, unknown>;

    return new Planeta({
      id: casted['id'] as string,
      nombre: casted['nombre'] as string,
      grupo: casted['grupo'] as string,
      descripcion: casted['descripcion'] as string,
      resumenCurso: casted['resumenCurso'] as string,
      imagen: casted['imagenResumen'] as string,
      estado: casted['estado'] as boolean,
      fechaCreacion: casted['fechaCreacion'] as Date,
      fechaActualizacion: casted['fechaActualizacion'] as Date,
      galaxiaId: casted['galaxiaId'] as string,
      galaxia: casted['galaxia'] as string,
      tema: casted['tema'] as string,
    });
  }

  static toJson(planeta: Planeta): IPlanetaDto {
    return {
      id: planeta.id,
      nombre: planeta.nombre,
      grupo: planeta.grupo,
      descripcion: planeta.descripcion,
      resumenCurso: planeta.resumenCurso,
      imagenResumen: planeta.imagen,
      estado: planeta.estado,
      fechaCreacion: planeta.fechaCreacion,
      fechaActualizacion: planeta.fechaActualizacion,
      galaxiaId: planeta.galaxiaId,      
      tema: planeta.tema,
    };
  }
  
}


