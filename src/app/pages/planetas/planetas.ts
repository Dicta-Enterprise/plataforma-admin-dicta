import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Planeta } from '@class/planetas/Planeta.class';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { PlanetaFacade } from 'src/app/patterns/facade/planetas.facade';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { MODELS_ENUM } from 'src/app/core/enums/models.enum';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { FormatoTexto } from 'src/app/shared/pipes/formato-texto.pipe';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-planetas',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    DividerModule,
    FormatoTexto,
    TagModule,
  ],
  providers: [
    PlanetaFacade,
    PlanetaService,
  ],
  templateUrl: './planetas.html',
  styleUrl: './planetas.css',
})
export class Planetas implements OnInit, OnDestroy {

  public subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  loading = false;

  planetas$ = new BehaviorSubject<Planeta[]>([]);

  constructor(
    private readonly planetaFacade: PlanetaFacade,
    private modalService: ModalService
  ) {
    this.planetas$ = this.planetaFacade.planetas$;
  }

  ngOnInit(): void {
    this.planetaFacade.listarPlanetas();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  verImagen(planeta: Planeta): void {
    this.modalService.openByName(MODELS_ENUM.IMAGEN_PLANETA, {
      title: planeta.nombre,
      planeta: planeta,
    });
  }

  editar(id: string): void {
    console.log('Editar:', id);
  }  

  nuevoPlaneta() {
    this.modalService.openByName(MODELS_ENUM.NUEVO_PLANETA, {
      title: 'Nuevo Planeta',
      message: 'Vino desde el registry',
    });
  }

  eliminar(id: string): void {
    console.log('Eliminar:', id);
  }
}
