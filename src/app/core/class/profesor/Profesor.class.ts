
export class Profesor {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  estado: boolean;
  imagen: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  fechaNacimiento: Date;

  constructor(profesor: Partial<Profesor> = {}) {
    this.id = profesor.id ?? '';
    this.nombre = profesor.nombre ?? '';
    this.apellido = profesor.apellido ?? '';
    this.email = profesor.email ?? '';
    this.telefono = profesor.telefono ?? '';
    this.direccion = profesor.direccion ?? '';
    this.estado = profesor.estado ?? true;
    this.imagen = profesor.imagen ?? '';
    this.fechaCreacion = profesor.fechaCreacion ?? new Date();
    this.fechaActualizacion = profesor.fechaActualizacion ?? new Date();
    this.fechaNacimiento = profesor.fechaNacimiento || new Date();
  }

  static fromJson(profesor: any): Profesor {
    return new Profesor({
      id: profesor.id,
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      email: profesor.email,
      telefono: profesor.telefono,
      direccion: profesor.direccion,
      estado: profesor.estado,
      imagen: profesor.imagen,
      fechaCreacion: profesor.fechaCreacion,
      fechaActualizacion: profesor.fechaActualizacion,
      fechaNacimiento: new Date(profesor.fechaNacimiento),
    });
  }

  static toJson(profesor: Profesor): any {
    return {
      nombre: profesor.nombre,
      apellido: profesor.apellido,
      email: profesor.email,
      telefono: profesor.telefono,
      direccion: profesor.direccion,
      estado: profesor.estado,
      imagen: profesor.imagen,
      fechaNacimiento: profesor.fechaNacimiento,
    };
  }
}
