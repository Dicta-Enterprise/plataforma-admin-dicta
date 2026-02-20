import { Type } from '@angular/core';
import { NuevaCategoria } from 'src/app/ui/modals/categoria/nueva-categoria.modal';
import { UserModalComponent } from 'src/app/ui/modals/user.modal.component';
import { EditarParametro } from 'src/app/ui/modals/editar-parametro/editar-parametro';
import { NuevaLanding } from 'src/app/ui/modals/landing/nueva-landing.modal';


export const MODAL_REGISTRY: Record<string, Type<object>> = {
  user: UserModalComponent,
  nuevaCategoria:NuevaCategoria,
  editarParametro: EditarParametro,
  nuevaLanding: NuevaLanding, 
};