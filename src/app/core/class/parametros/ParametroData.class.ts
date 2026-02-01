export class ParametroData {
  value: string;
  code: string;
  checked?: boolean;

  constructor(parametro: Partial<ParametroData> = {}) {
    this.value = parametro.value ?? '';
    this.code = parametro.code ?? '';
    this.checked = parametro.checked ?? true;
    
  }

  static fromJson(parametro: unknown): ParametroData {
    const casted = parametro as Record<string, unknown>;
    return new ParametroData({
      value: casted['value'] as string,
      code: casted['code'] as string,
    });
  }

  static toJson(parametro: ParametroData): unknown {
    return {

      value: parametro.value,
      code: parametro.code,
    };
  }
}
