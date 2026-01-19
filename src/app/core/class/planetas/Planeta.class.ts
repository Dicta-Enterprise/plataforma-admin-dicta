export class Planeta {
  id: string;
  nombre: string;
  descripcion: string;
  imagenResumen: string;
  imagenBeneficios: string;
  estado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  galaxiaId: string;

  constructor(planeta: Partial<Planeta> = {}) {
    this.id = planeta.id ?? '';
    this.nombre = planeta.nombre ?? '';
    this.descripcion = planeta.descripcion ?? '';
    this.imagenResumen = planeta.imagenResumen ?? '';
    this.imagenBeneficios = planeta.imagenBeneficios ?? '';
    this.estado = planeta.estado ?? true;
    this.fechaCreacion = planeta.fechaCreacion ?? new Date();
    this.fechaActualizacion = planeta.fechaActualizacion ?? new Date();
    this.galaxiaId = planeta.galaxiaId ?? '';
  }

  static fromJson(planeta: unknown): Planeta {
    const casted = planeta as Record<string, unknown>;

    return new Planeta({
      id: casted['id'] as string,
      nombre: casted['nombre'] as string,
      descripcion: casted['descripcion'] as string,
      imagenResumen: casted['imagenResumen'] as string,
      imagenBeneficios: casted['imagenBeneficios'] as string,
      estado: casted['estado'] as boolean,
      fechaCreacion: casted['fechaCreacion'] as Date,
      fechaActualizacion: casted['fechaActualizacion'] as Date,
      galaxiaId: casted['galaxiaId'] as string,
    });
  }

  static toJson(planeta: Planeta): unknown {
    return {
      nombre: planeta.nombre,
      descripcion: planeta.descripcion,
      imagenResumen: planeta.imagenResumen,
      imagenBeneficios: planeta.imagenBeneficios,
      estado: planeta.estado,
      fechaCreacion: planeta.fechaCreacion,
      fechaActualizacion: planeta.fechaActualizacion,
      galaxiaId: planeta.galaxiaId,
    };
  }
  
}


