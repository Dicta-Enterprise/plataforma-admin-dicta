import { Type } from '@angular/core';
import { NuevaCategoria } from 'src/app/ui/modals/categoria/nueva-categoria.modal';
import { UserModalComponent } from 'src/app/ui/modals/user.modal.component';
import { NuevoCursoModal } from 'src/app/ui/modals/curso/nuevo-curso.modal';

export const MODAL_REGISTRY: Record<string, Type<object>> = {
  user: UserModalComponent,
  nuevaCategoria: NuevaCategoria,
  nuevoCurso: NuevoCursoModal,
};
