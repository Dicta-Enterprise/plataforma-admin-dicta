
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
    this.fechaActualizacion =
      categoria.fechaActualizacion ?? new Date();
  }

  static fromJson(categoria: any): Categoria {    
    return new Categoria({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      imagenUrl: categoria.imagenUrl,
      estado: categoria.estado ,
      fechaCreacion: categoria.fechaCreacion,
      fechaActualizacion: categoria.fechaActualizacion,
    });
  }

  static toJson(categoria: Categoria): any {
    return {
      //id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      estado: categoria.estado,
      fechaCreacion: categoria.fechaCreacion,
      fechaActualizacion: categoria.fechaActualizacion,
    };
  }

}
