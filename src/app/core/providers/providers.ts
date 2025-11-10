import { Provider } from '@angular/core';
import { CUSTOM_CATEGORIAS_PROVIDER } from './categoria.provider';
import { CUSTOM_GALAXIA_PROVIDER } from './galaxia.provider';
import { CURSO_PROVIDERS } from './curso.provider';

export const CUSTOM_PROVIDERS: Provider[] = [
  ...CUSTOM_CATEGORIAS_PROVIDER,
  ...CUSTOM_GALAXIA_PROVIDER,
  ...CURSO_PROVIDERS,
];
