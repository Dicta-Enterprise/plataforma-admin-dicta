import { Injectable } from '@angular/core';
import { Parametro } from '@class/parametros/Parametro.class';
import { BehaviorSubject } from 'rxjs';
import { ParametroService } from 'src/app/core/services/parametros/parametro.service';

@Injectable({
  providedIn: 'root',
})
export class ParametroFacade {
  parametros$ = new BehaviorSubject<Parametro[]>([]);
  parametro$ = new BehaviorSubject<Parametro>(new Parametro());

  constructor(private readonly parametroService: ParametroService) {console.log('ParametroFacade initialized');}

  listarParametros() {
    console.log('Listing parametros');
    this.parametroService
      .listarParametros()
      .subscribe((parametros) => this.parametros$.next(parametros));
  }

  guardarParametro(parametro: Parametro) {
    this.parametroService
      .guardarParametro(parametro)
      .subscribe((parametro) => this.parametro$.next(parametro));
  }

}
