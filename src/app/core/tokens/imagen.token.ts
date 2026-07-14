import { InjectionToken } from '@angular/core';
import { ImagenRepository } from 'src/app/repositories/imagen.repository';

export const IMAGEN_REPOSITORY = new InjectionToken<ImagenRepository>(
  'ImagenRepository'
);