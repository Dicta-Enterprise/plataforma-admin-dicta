import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Parametro } from '@class/parametros/Parametro.class';
import { ParametroFacade } from 'src/app/patterns/parametro.facade';
import { OnInit, OnDestroy } from '@angular/core';
import { ParametroService } from 'src/app/core/services/parametros/parametro.service';
import { EditarParametro } from 'src/app/ui/modals/editar-parametro/editar-parametro';

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [CommonModule, ButtonModule, AccordionModule, TableModule, DialogModule, EditarParametro],
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

  ) { console.log('Parametros component initialized');
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

  visible = false;

  showDialog() {
    this.visible = true;

    
  }
  trackByName(index: number, item: unknown): string {
    return (item as { name: string }).name;
  }

}
