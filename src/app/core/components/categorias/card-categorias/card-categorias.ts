import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Categoria } from '@class/categoria/Categoria.class';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-card-categorias',
  imports: [ButtonModule],
  templateUrl: './card-categorias.html',
  styleUrl: './card-categorias.css',
})
export class CardCategorias {
  @Input() categoria: Categoria = new Categoria({});
  @Output() eliminarEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() editarEmit: EventEmitter<string> = new EventEmitter<string>();

  eliminar(id: string) {
    this.eliminarEmit.emit(id);
  }

  editar(id: string) {
    this.editarEmit.emit(id);
  }
}
