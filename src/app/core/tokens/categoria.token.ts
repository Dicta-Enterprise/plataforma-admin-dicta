import { InjectionToken } from '@angular/core';
import { CategoriaRepository } from 'src/app/repositories/categoria.repository';

export const CATEGORIA_REPOSITORY = new InjectionToken<CategoriaRepository>(
  'CategoriaRepository'
);
