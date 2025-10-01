import { InjectionToken } from '@angular/core';
import { GalaxiaRepository } from 'src/app/repositories/galaxia.repository';

export const GALAXIA_REPOSITORY = new InjectionToken<GalaxiaRepository>(
  'GalaxiaRepository'
);
