import { ParametroData } from './ParametroData.class';

export class Parametro {
  name: string;
  parametrosData: ParametroData[];

  constructor(parametro: Partial<Parametro> = {}) {
    this.name = parametro.name ?? '';
    this.parametrosData = parametro.parametrosData ?? [];
    
  }

  static fromJson(name: string, parametroValues: unknown): Parametro {
    return new Parametro({name: name,
      parametrosData: (parametroValues as ParametroData[]).map(ParametroData.fromJson),
    });
  }

  static toJson(parametro: Parametro): unknown {
    const result: Record<string, unknown> = {};
    result[parametro.name] = parametro.parametrosData;
    return result;
  }
}
