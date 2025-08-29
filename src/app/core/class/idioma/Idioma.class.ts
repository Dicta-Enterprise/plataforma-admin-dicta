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

  static fromJson(idioma: any): Idioma {
    return new Idioma({
      id: idioma.id,
      nombre: idioma.nombre,
      descripcion: idioma.descripcion,
      estado: idioma.estado,
      fechaCreacion: idioma.fechaCreacion,
      fechaActualizacion: idioma.fechaActualizacion,
    });
  }

  static toJson(idioma: Idioma): any {
    return {
      nombre: idioma.nombre,
      descripcion: idioma.descripcion,
      estado: idioma.estado,
      fechaCreacion: idioma.fechaCreacion,
      fechaActualizacion: idioma.fechaActualizacion,
    };
  }
}
