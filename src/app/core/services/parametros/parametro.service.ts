import { Inject, Injectable } from '@angular/core';
import { Parametro } from '@class/parametros/Parametro.class';
import { Observable } from 'rxjs';
import { PARAMETRO_REPOSITORY } from '../../tokens/parametro.token';
import { ParametroRepository } from 'src/app/repositories/parametro.repository';
console.log('ParametroService file loaded');
@Injectable({
  providedIn: 'root',
})
export class ParametroService {
  constructor(
    @Inject(PARAMETRO_REPOSITORY)
    private readonly parametroRepository: ParametroRepository
  ) {console.log('ParametroService initialized');}

  listarParametros(): Observable<Parametro[]> {
    return this.parametroRepository.listarParametrosService();
  }

  guardarParametro(parametro: Parametro): Observable<Parametro> {
    return this.parametroRepository.crearParametroService(parametro);
  }

 
}
