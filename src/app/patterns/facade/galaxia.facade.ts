import { Injectable } from '@angular/core';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { CreateGalaxiaDto, CreateMultipleGalaxiasDto } from '@interfaces/galaxias/Igalaxia.dto';
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

  guardarGalaxia(dto: CreateGalaxiaDto, onSuccess?: (galaxia: Galaxia) => void) {    
    this.galaxiaService
      .guardarGalaxia(dto)
      .subscribe(resp => {
        this.galaxia$.next(resp);
        if (onSuccess) onSuccess(resp);
      });
  }

  guardarMultiplesGalaxias(data: CreateMultipleGalaxiasDto, onSuccess?: (galaxias: Galaxia[]) => void) {
    this.galaxiaService
      .guardarMultiplesGalaxias(data)
      .subscribe((galaxias) => {
        this.listarGalaxias();
        if (onSuccess) onSuccess(galaxias);
      });
  }

  obtenerGalaxia(id: string) {
    this.galaxiaService
      .obtenerGalaxia(id)
      .subscribe((galaxia) => this.galaxia$.next(galaxia));
  }

  actualizarGalaxia(galaxia: Galaxia) {
    this.galaxiaService
      .actualizarGalaxia(galaxia)
      .subscribe((galaxia) => this.galaxia$.next(galaxia));
  }

  eliminarGalaxia(id: string) {
    this.galaxiaService.eliminarGalaxia(id).subscribe({
      next: () => {
        this.listarGalaxias();
      },
      error: (err) => {
        console.error('Error eliminando galaxia', err?.error || err);
      },
    });
  }

}
