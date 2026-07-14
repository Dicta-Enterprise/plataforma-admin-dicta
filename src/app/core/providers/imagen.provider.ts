import { Provider } from '@angular/core';
import { IMAGEN_REPOSITORY } from '../tokens/imagen.token';
import { ImagenRepositoryImpl } from 'src/app/infraestructure/imagen.repository.impl';

export const CUSTOM_IMAGEN_PROVIDER: Provider[] = [
  {
    provide: IMAGEN_REPOSITORY,
    useClass: ImagenRepositoryImpl,
  },
];