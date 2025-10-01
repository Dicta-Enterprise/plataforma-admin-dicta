import { Categoria } from '@class/categoria/Categoria.class';
import { IGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';

export class Galaxia {
  id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  imagenUrl:string;
  categoria: Categoria;

  constructor(galaxia: Partial<Galaxia> = {}) {
    this.id = galaxia.id ?? '';
    this.nombre = galaxia.nombre ?? '';
    this.descripcion = galaxia.descripcion ?? '';
    this.estado = galaxia.estado ?? true;
    this.fechaCreacion = galaxia.fechaCreacion ?? new Date();
    this.fechaActualizacion = galaxia.fechaActualizacion ?? new Date();
    this.imagenUrl = galaxia.imagenUrl ?? '';
    this.categoria = galaxia.categoria ?? new Categoria();
  }

  static fromJson(galaxia: unknown): Galaxia {
    const casted = galaxia as Record<string, unknown>;

    return new Galaxia({
      id: casted['id'] as string,
      nombre: casted['nombre'] as string,
      descripcion: casted['descripcion'] as string,
      estado: casted['estado'] as boolean,
      fechaCreacion: casted['fechaCreacion'] as Date,
      fechaActualizacion: casted['fechaActualizacion'] as Date,
      imagenUrl: casted['imagen'] as string,
      categoria: casted['categoria'] as Categoria
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
