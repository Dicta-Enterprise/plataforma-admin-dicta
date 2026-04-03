import { IPlanetaDto } from '@interfaces/planeta/iPlaneta.interface';
import { InfoPlaneta, Peligro, Beneficio } from '@interfaces/planeta/iPlaneta.interface';

export class Planeta {
  id: string;
  nombre: string;
  codigo: string;
  categoria: string;
  resumenCurso: string;
  imagenResumen: string;
  estado: string;
  galaxiaId: string;
  galaxia: string;  
  textura: string;
  url: string;
  info?: InfoPlaneta;
  peligros: Peligro[]=[];
  beneficios: Beneficio[]=[];

  constructor(planeta: Partial<Planeta> = {}) {
    this.id = planeta.id ?? '';
    this.nombre = planeta.nombre ?? '';
    this.codigo = planeta.codigo ?? '';
    this.categoria = planeta.categoria ?? '';
    this.resumenCurso = planeta.resumenCurso ?? '';
    this.imagenResumen = planeta.imagenResumen ?? '';
    this.estado = planeta.estado ?? 'ACTIVO';
    this.galaxiaId = planeta.galaxiaId ?? '';
    this.galaxia = planeta.galaxia ?? '';  
    this.textura = planeta.textura ?? '';
    this.url = planeta.url ?? '';
    this.info = planeta.info;
    this.peligros = planeta.peligros ?? [];
    this.beneficios = planeta.beneficios ?? [];  
  }

  static fromJson(planeta: unknown): Planeta {
    const casted = planeta as Record<string, unknown>;

    return new Planeta({
      id: casted['id'] as string,
      nombre: casted['nombre'] as string,
      codigo: casted['codigo'] as string,
      categoria: casted['categoria'] as string,
      resumenCurso: casted['resumenCurso'] as string,
      imagenResumen: casted['imagenResumen'] as string,
      estado: casted['estado'] as string,
      galaxiaId: casted['galaxiaId'] as string,
      galaxia: casted['galaxia'] as string,
      textura: casted['textura'] as string,
      url: casted['url'] as string,
      info: casted['info'] as InfoPlaneta,
      peligros: casted['peligros'] as Peligro[],
      beneficios: casted['beneficios'] as Beneficio[],
    });
  }

  static toJson(planeta: Planeta): IPlanetaDto {
    return {
      id: planeta.id,
      nombre: planeta.nombre,
      codigo: planeta.codigo,
      categoria: planeta.categoria,
      resumenCurso: planeta.resumenCurso,
      imagenResumen: planeta.imagenResumen,
      estado: planeta.estado,
      galaxiaId: planeta.galaxiaId,      
      galaxia: planeta.galaxia,
      textura: planeta.textura,
      url: planeta.url,
      info: planeta.info,
      peligros: planeta.peligros,
      beneficios: planeta.beneficios,
    };
  }
  
}


