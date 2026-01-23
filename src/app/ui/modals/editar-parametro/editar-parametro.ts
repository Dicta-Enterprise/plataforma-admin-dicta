import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-editar-parametro',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './editar-parametro.html',
  styleUrls: ['./editar-parametro.css']
})
export class EditarParametro {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
