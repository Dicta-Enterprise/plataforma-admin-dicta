import { InjectionToken } from '@angular/core';
import { PlanetaRepository } from 'src/app/repositories/planeta.repository';

export const PLANETA_REPOSITORY = new InjectionToken<PlanetaRepository>(
  'PlanetaRepository'
);
