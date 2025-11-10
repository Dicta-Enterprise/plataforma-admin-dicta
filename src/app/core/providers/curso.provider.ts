import { Provider } from '@angular/core';
import { CURSO_REPOSITORY } from '../tokens/curso.token';
import { CursoRepositoryImpl } from 'src/app/infraestructure/curso.repository.impl';

export const CURSO_PROVIDERS: Provider[] = [
  {
    provide: CURSO_REPOSITORY,
    useClass: CursoRepositoryImpl,
  },
];

