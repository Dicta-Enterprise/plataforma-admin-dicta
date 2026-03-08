import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Parametro } from '@class/parametros/Parametro.class';
import { ParametroFacade } from 'src/app/patterns/parametro.facade';
import { ParametroService } from 'src/app/core/services/parametros/parametro.service';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleSwitchChangeEvent } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ParametroData } from '@class/parametros/ParametroData.class';


@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, AccordionModule, TableModule, DialogModule,ToggleSwitchModule], 
  providers: [
    ParametroFacade,
    ParametroService,
  ],
  templateUrl: './parametros.html',
  styleUrls: ['./parametros.css'],
})
export class Parametros implements OnInit, OnDestroy {
  public subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  parametros$ = new BehaviorSubject<Parametro[]>([]);

  constructor(
    private readonly parametroFacade: ParametroFacade,
    private readonly modalService: ModalService,
  ) {
    console.log('Parametros component initialized');
    this.parametros$ = this.parametroFacade.parametros$;
  }

  ngOnInit(): void {
    console.log('Initializing Parametros component');
    this.parametroFacade.listarParametros();
    this.parametros$.subscribe(parametros => {
      console.log('Parametros updated:', parametros);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleChange(event: ToggleSwitchChangeEvent, child: ParametroData): void {
    console.log('Código del parámetro:', child.code);
    console.log('Nuevo estado:', event.checked);
  }

  showDialog() {
    this.modalService.openByName('editarParametro');
  }

  trackByName(index: number, item: unknown): string {
    return (item as { name: string }).name;
  }
}
