
export class Planeta {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  estado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  galaxiaId: string;

  constructor(planeta: Partial<Planeta> = {}) {
    this.id = planeta.id ?? '';
    this.nombre = planeta.nombre ?? '';
    this.descripcion = planeta.descripcion ?? '';
    this.imagen = planeta.imagen ?? '';
    this.estado = planeta.estado ?? true;
    this.fechaCreacion = planeta.fechaCreacion ?? new Date();
    this.fechaActualizacion = planeta.fechaActualizacion ?? new Date();
    this.galaxiaId = planeta.galaxiaId ?? '';
  }

  static fromJson(planeta: any): Planeta {
    return new Planeta({
      id: planeta.id,
      nombre: planeta.nombre,
      descripcion: planeta.descripcion,
      imagen: planeta.imagen,
      estado: planeta.estado,
      fechaCreacion: planeta.fechaCreacion,
      fechaActualizacion: planeta.fechaActualizacion,
      galaxiaId: planeta.galaxiaId,
    });
  }

  static toJson(planeta: Planeta): any {
    return {
      nombre: planeta.nombre,
      descripcion: planeta.descripcion,
      imagen: planeta.imagen,
      estado: planeta.estado,
      fechaCreacion: planeta.fechaCreacion,
      fechaActualizacion: planeta.fechaActualizacion,
      galaxiaId: planeta.galaxiaId,
    };
  }
}
