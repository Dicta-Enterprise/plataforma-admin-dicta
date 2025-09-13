import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { StyleClassModule } from 'primeng/styleclass';
import { CUSTOM_PROVIDERS } from './core/providers/providers';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [ButtonModule, RouterOutlet, StyleClassModule],
  providers: [...CUSTOM_PROVIDERS],
})
export class App implements OnInit {
  protected title = 'plataforma-admin-dicta';

  constructor(private primeng: PrimeNG) {}

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
}
