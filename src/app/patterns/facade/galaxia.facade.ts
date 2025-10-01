import { Injectable } from '@angular/core';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { BehaviorSubject } from 'rxjs';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';

@Injectable({
  providedIn: 'root',
})
export class GalaxiaFacade {
  galaxias$ = new BehaviorSubject<Galaxia[]>([]);
  galaxia$ = new BehaviorSubject<Galaxia>(new Galaxia());

  constructor(private readonly galaxiaService: GalaxiaService) {}

  listarGalaxias() {
    this.galaxiaService
      .listarGalaxias()
      .subscribe((galaxia) => this.galaxias$.next(galaxia));
  }
}
