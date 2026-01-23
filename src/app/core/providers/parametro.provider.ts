import { Provider } from '@angular/core';
import { PARAMETRO_REPOSITORY } from '../tokens/parametro.token';
import { ParametroRepositoryImpl } from 'src/app/infraestructure/parametro.repository.impl';

export const CUSTOM_PARAMETROS_PROVIDER: Provider[] = [
  {
    provide: PARAMETRO_REPOSITORY,
    useClass: ParametroRepositoryImpl,
  },
  {
    provide: 'STATE_CONFIG',
    useValue: { i18nLang: 'es', secretKey: 'abc123' },
  },
];