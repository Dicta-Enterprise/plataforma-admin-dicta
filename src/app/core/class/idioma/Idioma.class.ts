export class Idioma {
  id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  constructor(idioma: Partial<Idioma> = {}) {
    this.id = idioma.id ?? '';
    this.nombre = idioma.nombre ?? '';
    this.descripcion = idioma.descripcion ?? '';
    this.estado = idioma.estado ?? true;
    this.fechaCreacion = idioma.fechaCreacion ?? new Date();
    this.fechaActualizacion = idioma.fechaActualizacion ?? new Date();
  }

  static fromJson(idioma: unknown): Idioma {
    const casted = idioma as Record<string, unknown>;

    return new Idioma({
      id: casted['id'] as string,
      nombre: casted['nombre'] as string,
      descripcion: casted['descripcion'] as string,
      estado: casted['estado'] as boolean,
      fechaCreacion: casted['fechaCreacion'] as Date,
      fechaActualizacion: casted['fechaActualizacion'] as Date,
    });
  }

  static toJson(idioma: Idioma): unknown {
    return {
      nombre: idioma.nombre,
      descripcion: idioma.descripcion,
      estado: idioma.estado,
      fechaCreacion: idioma.fechaCreacion,
      fechaActualizacion: idioma.fechaActualizacion,
    };
  }
}
