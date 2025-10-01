import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CardGalaxias } from '@components//categorias/galaxias/card-galaxias';
import { GalaxiaFacade } from 'src/app/patterns/facade/galaxia.facade';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { CommonModule } from '@angular/common';
import { Estandar } from '@class/estandar/Estandar.class';

@Component({
  selector: 'app-galaxias',
  imports: [
    CommonModule,
    BadgeModule,
    ButtonModule,
    DividerModule,
    MultiSelectModule,
    StyleClassModule,
    ToggleButtonModule,
    FormsModule,
    MenuModule,
    CardGalaxias,
  ],
  providers: [GalaxiaFacade, GalaxiaService],
  templateUrl: './galaxias.html',
  styleUrl: './galaxias.css',
})
export class Galaxias implements OnInit, OnDestroy {
  categorias: Estandar[] = [];
  colors: Estandar[] = [];

  categoriaSelected: Estandar = new Estandar();
  colorSelected: Estandar = new Estandar();

  activos = false;
  inactivos = false;

  public subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  galaxias$ = new BehaviorSubject<Galaxia[]>([]);

  constructor(private readonly galaxiaFacade: GalaxiaFacade) {
    this.galaxias$ = this.galaxiaFacade.galaxias$;
  }

  ngOnInit(): void {
    this.galaxiaFacade.listarGalaxias();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  eliminar(id: string) {
    console.log(id);
  }

  editar(id: string) {
    console.log(id);
  }
}
