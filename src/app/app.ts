import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { StyleClassModule } from 'primeng/styleclass';
import { CUSTOM_PROVIDERS } from './core/providers/providers';
import { ModalHostComponent } from './containers/host/app-modal-host.component';
import { ModalService } from './containers/host/app-modal.service';
import { AlertService } from './containers/alerts/app-alert.service';
import { AlertHostComponent } from './containers/alerts/app-alert-host.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    ButtonModule,
    RouterOutlet,
    StyleClassModule,
    ModalHostComponent,
    AlertHostComponent,
  ],
  providers: [...CUSTOM_PROVIDERS, MessageService],
})
export class App implements OnInit, AfterViewInit {
  protected title = 'plataforma-admin-dicta';
  @ViewChild(ModalHostComponent) host!: ModalHostComponent;
  @ViewChild(AlertHostComponent) hostAlert!: AlertHostComponent;

  constructor(
    private primeng: PrimeNG,
    private modalService: ModalService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.primeng.setTranslation({
      startsWith: 'Empieza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Es igual a',
      notEquals: 'No es igual a',
      noFilter: 'Sin filtro',
      lt: 'Menor que',
      lte: 'Menor o igual que',
      gt: 'Mayor que',
      gte: 'Mayor o igual que',
      is: 'Es',
      isNot: 'No es',
      before: 'Antes',
      after: 'Después',
      clear: 'Limpiar',
      apply: 'Aplicar',
      matchAll: 'Coincide con todo',
      matchAny: 'Coincide con cualquiera',
      addRule: 'Agregar regla',
      removeRule: 'Eliminar regla',
      accept: 'Aceptar',
      reject: 'Cancelar',
    });
  }

  ngAfterViewInit() {
    this.modalService.registerHost(this.host);
    this.alertService.registerHost(this.hostAlert);
  }
}
