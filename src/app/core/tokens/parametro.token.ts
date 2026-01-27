import { InjectionToken } from '@angular/core';
import { ParametroRepository } from 'src/app/repositories/parametro.repository';
console.log('Defining PARAMETRO_REPOSITORY token');
export const PARAMETRO_REPOSITORY = new InjectionToken<ParametroRepository>(
  'ParametroRepository'
);
