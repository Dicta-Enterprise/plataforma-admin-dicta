import { IPlanetaDto } from '@interfaces/planeta/iPlaneta.interface';

export class Planeta {
  id: string;
  nombre: string;
  categoria: string;
  resumenCurso: string;
  imagen: string;
  estado: boolean;
  galaxiaId: string;
  galaxia: string;  

  constructor(planeta: Partial<Planeta> = {}) {
    this.id = planeta.id ?? '';
    this.nombre = planeta.nombre ?? '';
    this.categoria = planeta.categoria ?? '';
    this.resumenCurso = planeta.resumenCurso ?? '';
    this.imagen = planeta.imagen ?? '';
    this.estado = planeta.estado ?? true;
    this.galaxiaId = planeta.galaxiaId ?? '';
    this.galaxia = planeta.galaxia ?? '';    
  }

  static fromJson(planeta: unknown): Planeta {
    const casted = planeta as Record<string, unknown>;

    return new Planeta({
      id: casted['id'] as string,
      nombre: casted['nombre'] as string,
      categoria: casted['grupo'] as string,
      resumenCurso: casted['resumenCurso'] as string,
      imagen: casted['imagenResumen'] as string,
      estado: casted['estado'] as boolean,
      galaxiaId: casted['galaxiaId'] as string,
      galaxia: casted['tema'] as string,
      
    });
  }

  static toJson(planeta: Planeta): IPlanetaDto {
    return {
      id: planeta.id,
      nombre: planeta.nombre,
      grupo: planeta.categoria,
      resumenCurso: planeta.resumenCurso,
      imagenResumen: planeta.imagen,
      estado: planeta.estado,
      galaxiaId: planeta.galaxiaId,      
      tema: planeta.galaxia,
    };
  }
  
}


