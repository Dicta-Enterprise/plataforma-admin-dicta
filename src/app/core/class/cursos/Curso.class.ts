
export class Curso {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  fechaInicio: Date;
  fechaFinalizacion: Date;
  cantidadAlumnos: string;
  precio: string;
  estado: boolean;
  imagen: string;
  video: string;
  duracion: string;
  categoriaId: string;
  profesorId: string;
  idiomaId: string; 
  planetaId: string; 

  constructor(curso: Partial<Curso> = {}) {
    this.id = curso.id ?? '';
    this.nombre = curso.nombre ?? '';
    this.descripcion = curso.descripcion ?? '';
    this.fechaCreacion = curso.fechaCreacion ?? new Date();
    this.fechaActualizacion = curso.fechaActualizacion ?? new Date();
    this.fechaInicio = curso.fechaInicio ?? new Date();
    this.fechaFinalizacion = curso.fechaFinalizacion ?? new Date();
    this.cantidadAlumnos = curso.cantidadAlumnos ?? '';
    this.precio = curso.precio ?? '';
    this.profesorId = curso.profesorId ?? '';
    this.estado = curso.estado ?? true;
    this.imagen = curso.imagen ?? '';
    this.video = curso.video ?? '';
    this.duracion = curso.duracion ?? '';
    this.categoriaId = curso.categoriaId ?? '';
    this.idiomaId = curso.idiomaId ?? '';
    this.planetaId = curso.planetaId ?? '';
  }

  static fromJson(curso: any): Curso {
    return new Curso({
      id: curso.id,
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      fechaCreacion: curso.fechaCreacion,
      fechaActualizacion: curso.fechaActualizacion,
      fechaInicio: new Date(curso.fechaInicio),
      fechaFinalizacion: new Date(curso.fechaFinalizacion),
      cantidadAlumnos: curso.cantidadAlumnos,
      precio: curso.precio,
      profesorId: curso.profesorId,
      estado: curso.estado,
      imagen: curso.imagen,
      video: curso.video,
      duracion: curso.duracion,
      categoriaId: curso.categoriaId,
      idiomaId: curso.idiomaId,
      planetaId: curso.planetaId,
    });
  }

  static toJson(curso: Curso): any {
    return {
      //id: curso.id,
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      //fechaCreacion: curso.fechaCreacion,
      //fechaActualizacion: curso.fechaActualizacion,
      fechaInicio: curso.fechaInicio,
      fechaFinalizacion: curso.fechaFinalizacion,
      cantidadAlumnos: curso.cantidadAlumnos,
      precio: curso.precio,
      profesorId: curso.profesorId,
      estado: curso.estado,
      imagen: curso.imagen,
      video: curso.video,
      duracion: curso.duracion,
      categoriaId: curso.categoriaId,
      idiomaId: curso.idiomaId,
      planetaId: curso.planetaId,
    };
  }
}
