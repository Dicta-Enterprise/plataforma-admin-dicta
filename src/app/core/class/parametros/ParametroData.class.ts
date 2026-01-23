export class ParametroData {
  id: string;
  value: string;
  code: string;

  constructor(parametro: Partial<ParametroData> = {}) {
    this.id = parametro.id ?? '';
    this.value = parametro.value ?? '';
    this.code = parametro.code ?? '';
    
  }

  static fromJson(parametro: unknown): ParametroData {
    const casted = parametro as Record<string, unknown>;
    return new ParametroData({
      id: casted['id'] as string,
      value: casted['value'] as string,
      code: casted['code'] as string,
    });
  }

  static toJson(parametro: ParametroData): unknown {
    return {
      id: parametro.id,
      value: parametro.value,
      code: parametro.code,
    };
  }
}
