import { Provider } from '@angular/core';
import { LANDING_REPOSITORY } from '../tokens/landing.token';
import { LandingRepositoryImpl } from 'src/app/infraestructure/landing.repository.impl';

export const CUSTOM_LANDING_PROVIDER: Provider[] = [
  {
    provide: LANDING_REPOSITORY,
    useClass: LandingRepositoryImpl,
  },

];