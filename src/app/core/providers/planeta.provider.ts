import { Provider } from '@angular/core';
import { PLANETA_REPOSITORY } from '../tokens/planeta.token';
import { PlanetaRepositoryImpl } from 'src/app/infraestructure/planeta.repository.impl';

export const CUSTOM_PLANETA_PROVIDER: Provider[] = [
  {
    provide: PLANETA_REPOSITORY,
    useClass: PlanetaRepositoryImpl,
  },
];
