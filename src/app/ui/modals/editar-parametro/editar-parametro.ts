import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ModalService } from 'src/app/containers/host/app-modal.service';

@Component({
  selector: 'app-editar-parametro',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './editar-parametro.html',
  styleUrls: ['./editar-parametro.css']
})
export class EditarParametro {

  constructor(private modalService: ModalService) {}

  onHide() {
    this.modalService.close();
  }
}
