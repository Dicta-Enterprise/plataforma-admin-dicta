export class Estandar {
  id: string;
  descripcion: string;

  constructor(estandar: Partial<Estandar> = {}) {
    this.id = estandar.id ?? '';
    this.descripcion = estandar.descripcion ?? '';
  }

  static fromJson(estandar: unknown): Estandar {
    const casted = estandar as Record<string, unknown>;

    return new Estandar({
      id: casted['id'] as string,
      descripcion: casted['descripcion'] as string,
    });
  }

  static toJson(estandar: Estandar): unknown {
    return {
      id: estandar.id,
    };
  }
}
