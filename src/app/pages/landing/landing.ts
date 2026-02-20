import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Landing } from '@class/landing/Landing.class';
import { LandingFacade } from 'src/app/patterns/facade/landing.facade';
import { LandingService } from 'src/app/core/services/landing/landing.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { MODELS_ENUM } from 'src/app/core/enums/models.enum';;




@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TableModule,IconFieldModule,InputIconModule,SelectModule,TagModule],
  providers: [LandingFacade, LandingService],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingPage implements OnInit, OnDestroy {
  private subscription = new Subscription();

  landings: Landing[] = [];

  estados = [
    {label: 'Activo', value: true},
    {label : 'No activo', value: false},
  ];
  
  getEstadoSeverity(estado: boolean): 'success' | 'danger' {
    return estado? 'success' : 'danger';
  }

  constructor(private readonly landingFacade: LandingFacade,
    private readonly modalService: ModalService,
  ) { }

  ngOnInit(): void {
    this.landingFacade.listarLandings();

    const sub = this.landingFacade.landings$.subscribe((data) => {
      this.landings = data;
    });

    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  

  nuevaLanding(): void {
    this.modalService.openByName(MODELS_ENUM.NUEVA_LANDING, {
      title: 'Nueva Landing',
      isEdit: false,
      model: new Landing({
        estado: true,
      }),
    });
  }


  editarLanding(row: Landing): void {
    this.modalService.openByName(MODELS_ENUM.NUEVA_LANDING, {
      title: 'Editar Landing',
      isEdit: true,
      landingId: row.id,
      model: { ...row },
    });
  }

  eliminarLanding(landing: Landing): void {
    const ok = confirm(`¿Eliminar landing "${landing.titulo}"?`);
    if (!ok) return;

    this.landingFacade.eliminarLanding(landing.id);
  }

}
