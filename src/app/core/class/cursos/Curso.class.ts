export class Curso {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date | null;
  fechaInicio: Date | null;
  fechaFinal: Date | null;
  precio: number | null;
  estado: boolean;
  imagen: string;
  duracionSemanas: number | null;
  categoriaId: string;
  profesorId: string;
  categoriaNombre: string;
  profesorNombre: string;
  beneficios: { titulo: string; descripcion: string }[];

  constructor(curso: Partial<Curso> = {}) {
    this.id = curso.id ?? '';
    this.nombre = curso.nombre ?? '';
    this.descripcion = curso.descripcion ?? '';
    this.fechaCreacion = curso.fechaCreacion ?? null;
    this.fechaInicio = curso.fechaInicio ?? null;
    this.fechaFinal = curso.fechaFinal ?? null;
    this.precio = curso.precio ?? null;
    this.estado = curso.estado ?? false;
    this.imagen = curso.imagen ?? '';
    this.duracionSemanas = curso.duracionSemanas ?? null;
    this.categoriaId = curso.categoriaId ?? '';
    this.profesorId = curso.profesorId ?? '';
    this.categoriaNombre = curso.categoriaNombre ?? '';
    this.profesorNombre = curso.profesorNombre ?? '';
    this.beneficios = Array.isArray(curso.beneficios)
      ? curso.beneficios.map((beneficio) => Curso.mapBeneficio(beneficio))
      : [];
  }

  static fromJson(raw: unknown): Curso {
    if (!raw || typeof raw !== 'object') {
      return new Curso();
    }

    const data = raw as Record<string, unknown>;

    const beneficios = Array.isArray(data['beneficios'])
      ? (data['beneficios'] as Record<string, unknown>[]).map((beneficio) => Curso.mapBeneficio(beneficio))
      : [];

    return new Curso({
      id: Curso.toString(data['id']),
      nombre: Curso.toString(data['nombre']),
      descripcion: Curso.toString(data['descripcion']),
      fechaCreacion: Curso.parseDate(data['fechaCreacion']),
      fechaInicio: Curso.parseDate(data['fechaInicio']),
      fechaFinal: Curso.parseDate(data['fechaFinal'] ?? data['fechaFinalizacion']),
      precio: Curso.toNumber(data['precio']),
      estado: Curso.toBoolean(data['estado']),
      imagen: Curso.toString(data['imagen']),
      duracionSemanas: Curso.toNumber(data['duracionSemanas']),
      categoriaId: Curso.toString(data['categoriaId']),
      profesorId: Curso.toString(data['profesorId']),
      categoriaNombre: Curso.toString(Curso.getRelacionNombre(data, 'categoria')),
      profesorNombre: Curso.toString(Curso.getRelacionNombre(data, 'profesor')),
      beneficios,
    });
  }

  static toJson(curso: Curso): unknown {
    return {
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      fechaInicio: curso.fechaInicio?.toISOString() ?? null,
      fechaFinal: curso.fechaFinal?.toISOString() ?? null,
      precio: curso.precio,
      estado: curso.estado,
      imagen: curso.imagen,
      duracionSemanas: curso.duracionSemanas,
      categoriaId: curso.categoriaId,
      profesorId: curso.profesorId,
      beneficios: curso.beneficios,
    };
  }

  private static parseDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private static toString(value: unknown): string {
    return value === undefined || value === null ? '' : String(value);
  }

  private static toNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }

  private static toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return false;
  }

  private static mapBeneficio(value: unknown): { titulo: string; descripcion: string } {
    const data = value as Record<string, unknown> | undefined;
    return {
      titulo: Curso.toString(data?.['titulo']),
      descripcion: Curso.toString(data?.['descripcion']),
    };
  }

  private static getRelacionNombre(
    data: Record<string, unknown>,
    relacion: string
  ): unknown {
    const relacionData = data[relacion] as Record<string, unknown> | undefined;
    return relacionData?.['nombre'];
  }
}



