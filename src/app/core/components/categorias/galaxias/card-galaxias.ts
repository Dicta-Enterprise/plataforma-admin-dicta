import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-card-galaxias',
  imports: [CommonModule, ButtonModule, StyleClassModule],
  templateUrl: './card-galaxias.html',
  styleUrl: './card-galaxias.css',
})
export class CardGalaxias {
  loader = 'assets/loaders/bottle-loader.gif';

  @Input() galaxia: Galaxia = new Galaxia();
  @Output() eliminarEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() editarEmit: EventEmitter<string> = new EventEmitter<string>();


  eliminar(id: string) {
    this.eliminarEmit.emit(id);
  }

  editar(id: string) {
    this.editarEmit.emit(id);
  }
}
