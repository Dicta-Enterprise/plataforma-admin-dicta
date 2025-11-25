import { Type } from '@angular/core';
import { NuevaCategoria } from 'src/app/ui/modals/categoria/nueva-categoria.modal';
import { EditarCursoModal } from 'src/app/ui/modals/curso/editar-curso.modal';
import { UserModalComponent } from 'src/app/ui/modals/user.modal.component';

export const MODAL_REGISTRY: Record<string, Type<object>> = {
  user: UserModalComponent,
  nuevaCategoria: NuevaCategoria,
  editarCurso: EditarCursoModal,
};
