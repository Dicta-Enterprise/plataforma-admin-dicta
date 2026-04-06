import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { take } from 'rxjs/operators';
import { Curso } from '@class/cursos/Curso.class';
import { CursoFacade } from 'src/app/patterns/facade/curso.facade';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { CURSO_PROVIDERS } from 'src/app/core/providers/curso.provider';
import { CursoService } from 'src/app/core/services/cursos/curso.service';


@Component({
  selector: 'app-eliminar-curso',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  providers: [CursoFacade, CursoService, ...CURSO_PROVIDERS],
  templateUrl: './eliminar-curso.modal.html',
})

export class EliminarCurso {
  @Input() curso: Curso = new Curso();
  @Output() eliminado = new EventEmitter<void>();
  visible = true;

  constructor(
    private readonly modalService: ModalService,
    private readonly cursoFacade: CursoFacade,
  ) {}

  confirmar(): void {
    this.cursoFacade.eliminarCurso(this.curso.id).pipe(take(1)).subscribe(() => {
      this.eliminado.emit();
      this.close();
    });
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }
  
}