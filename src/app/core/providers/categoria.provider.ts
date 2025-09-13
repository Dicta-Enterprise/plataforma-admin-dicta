import { Provider } from '@angular/core';
import { CATEGORIA_REPOSITORY } from '../tokens/categoria.token';
import { CategoriaRepositoryImpl } from 'src/app/infraestructure/categoria.repository.impl';

export const CUSTOM_CATEGORIAS_PROVIDER: Provider[] = [
  {
    provide: CATEGORIA_REPOSITORY,
    useClass: CategoriaRepositoryImpl,
  },
];
