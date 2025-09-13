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

  static fromJson(curso: unknown): Curso {
    const casted = curso as Record<string, unknown>;

    return new Curso({
      id: casted['id'] as string,
      nombre: casted['nombre'] as string,
      descripcion: casted['descripcion'] as string,
      fechaCreacion: casted['fechaCreacion'] as Date,
      fechaActualizacion: casted['fechaActualizacion'] as Date,
      fechaInicio: casted['fechaInicio)'] as Date,
      fechaFinalizacion: casted['fechaFinalizacion)'] as Date,
      cantidadAlumnos: casted['cantidadAlumnos'] as string,
      precio: casted['precio'] as string,
      profesorId: casted['profesorId'] as string,
      estado: casted['estado'] as boolean,
      imagen: casted['imagen'] as string,
      video: casted['video'] as string,
      duracion: casted['duracion'] as string,
      categoriaId: casted['categoriaId'] as string,
      idiomaId: casted['idiomaId'] as string,
      planetaId: casted['planetaId'] as string,
    });
  }

  static toJson(curso: Curso): unknown {
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
