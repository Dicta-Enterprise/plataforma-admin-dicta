import { Categoria } from '@class/categoria/Categoria.class';
import { IGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';

export class Galaxia {
  id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  categorias: Categoria[];

  constructor(galaxia: Partial<Galaxia> = {}) {
    this.id = galaxia.id ?? '';
    this.nombre = galaxia.nombre ?? '';
    this.descripcion = galaxia.descripcion ?? '';
    this.estado = galaxia.estado ?? true;
    this.fechaCreacion = galaxia.fechaCreacion ?? new Date();
    this.fechaActualizacion = galaxia.fechaActualizacion ?? new Date();
    this.categorias = galaxia.categorias ?? [];
  }

  static fromJson(galaxia: IGalaxiaDto): Galaxia {
    return new Galaxia({
      id: galaxia.id,
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      estado: galaxia.estado,
      fechaCreacion: galaxia.fechaCreacion,
      fechaActualizacion: galaxia.fechaActualizacion,
    });
  }

  static toJson(galaxia: Galaxia): IGalaxiaDto {
    return {
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      estado: galaxia.estado,
      fechaCreacion: galaxia.fechaCreacion,
      fechaActualizacion: galaxia.fechaActualizacion,
      id: galaxia.id,
    };
  }
}
