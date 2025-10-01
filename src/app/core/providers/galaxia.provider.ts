import { Provider } from '@angular/core';
import { GALAXIA_REPOSITORY } from '../tokens/galaxia.token';
import { GalaxiaRepositoryImpl } from 'src/app/infraestructure/galaxia.repository.impl';

export const CUSTOM_GALAXIA_PROVIDER: Provider[] = [
  {
    provide: GALAXIA_REPOSITORY,
    useClass: GalaxiaRepositoryImpl,
  },
];
