import { Provider } from '@angular/core';
import { CUSTOM_CATEGORIAS_PROVIDER } from './categoria.provider';
import { CUSTOM_GALAXIA_PROVIDER } from './galaxia.provider';
import { CURSO_PROVIDERS } from './curso.provider';
import { CUSTOM_PARAMETROS_PROVIDER } from './parametro.provider';
import { CUSTOM_LANDING_PROVIDER } from './landing.provider';
import { CUSTOM_PLANETA_PROVIDER } from './planeta.provider';

export const CUSTOM_PROVIDERS: Provider[] = [
  ...CUSTOM_CATEGORIAS_PROVIDER,
  ...CUSTOM_GALAXIA_PROVIDER,
  ...CURSO_PROVIDERS,
  ...CUSTOM_PARAMETROS_PROVIDER,
  ...CUSTOM_LANDING_PROVIDER,
  ...CUSTOM_PLANETA_PROVIDER,
];