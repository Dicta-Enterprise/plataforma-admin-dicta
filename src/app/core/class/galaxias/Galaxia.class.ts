import { IGalaxiaDto, CreateGalaxiaDto, Posicion, Rotacion } from '@interfaces/galaxias/Igalaxia.dto';

export class Galaxia {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  estado: boolean;
  categoriaId: string;

  tema: string;
  imagen: string;
  url: string;
  textura: string;

  posicion: Posicion;
  rotacion: Rotacion;

  fechaCreacion: Date;
  fechaActualizacion: Date;

  constructor(galaxia: Partial<Galaxia> = {}) {
    this.id = galaxia.id ?? '';
    this.nombre = galaxia.nombre ?? '';
    this.descripcion = galaxia.descripcion ?? '';
    this.color = galaxia.color ?? '';
    this.estado = galaxia.estado ?? true;
    
    this.categoriaId = galaxia.categoriaId ?? '';
    this.tema = galaxia.tema ?? '';
    this.imagen = galaxia.imagen ?? '';
    this.url = galaxia.url ?? '';
    this.textura = galaxia.textura ?? '';

    this.posicion = galaxia.posicion ?? { x: 0, y: 0, z: 0 };
    this.rotacion = galaxia.rotacion ?? { x: 0, y: 0, z: 0 };

    this.fechaCreacion = galaxia.fechaCreacion ?? new Date();
    this.fechaActualizacion = galaxia.fechaActualizacion ?? new Date();
  }

  static fromJson(dto: IGalaxiaDto): Galaxia {
    return new Galaxia({
      ...dto,      
      fechaCreacion: new Date(dto.fechaCreacion),
      fechaActualizacion: new Date(dto.fechaActualizacion),
    });
  }

  static toJson(galaxia: Galaxia): CreateGalaxiaDto {
    return {
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      imagen: galaxia.imagen,
      url: galaxia.url,
      textura: galaxia.textura,
      estado: galaxia.estado,
      tema: galaxia.tema,
      categoriaId: galaxia.categoriaId,
      color: galaxia.color,           
      posicion: galaxia.posicion,
      rotacion: galaxia.rotacion,
    };
  }
}