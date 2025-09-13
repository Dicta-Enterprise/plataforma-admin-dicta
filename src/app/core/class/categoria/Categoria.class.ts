import { ICategoriaDto } from '@interfaces/interfaces';

export class Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  estado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  constructor(categoria: Partial<Categoria> = {}) {
    this.id = categoria.id ?? '';
    this.nombre = categoria.nombre ?? '';
    this.descripcion = categoria.descripcion ?? '';
    this.imagenUrl = categoria.imagenUrl ?? 'assets/loaders/bottle-loader.gif';
    this.estado = categoria.estado ?? true;
    this.fechaCreacion = categoria.fechaCreacion ?? new Date();
    this.fechaActualizacion = categoria.fechaActualizacion ?? new Date();
  }

  static fromJson(categoria: unknown): Categoria {
    const casted = categoria as Record<string, unknown>;
    return new Categoria({
      id: casted['id'] as string,
      nombre: casted['nombre'] as string,
      descripcion: casted['descripcion'] as string,
      imagenUrl: casted['url'] as string,
      estado: casted['estado'] as boolean,
      fechaCreacion: casted['fechaCreacion'] as Date,
      fechaActualizacion: casted['fechaActualizacion'] as Date,
    });
  }

  static toJson(categoria: Categoria): ICategoriaDto {
    return {
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      estado: categoria.estado,
      fechaCreacion: categoria.fechaCreacion,
      fechaActualizacion: categoria.fechaActualizacion,
      url: categoria.imagenUrl,
    };
  }
}
