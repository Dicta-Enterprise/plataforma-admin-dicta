import { InjectionToken } from '@angular/core';
import { LandingRepository } from 'src/app/repositories/landing.repository';
console.log('Defining LANDING_REPOSITORY token');
export const LANDING_REPOSITORY = new InjectionToken<LandingRepository>(
  'LandingRepository'
);