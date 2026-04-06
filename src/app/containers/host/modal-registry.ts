import { Type } from '@angular/core';
import { NuevaCategoria } from 'src/app/ui/modals/categoria/nueva-categoria.modal';
import { UserModalComponent } from 'src/app/ui/modals/user.modal.component';
import { ImagenPlaneta } from 'src/app/ui/modals/planeta/imagen-planeta.modal';
import { NuevaGalaxia } from 'src/app/ui/modals/galaxia/nueva-galaxia.modal';
import { NuevoPlaneta } from 'src/app/ui/modals/planeta/nuevo-planeta.modal';
import { NuevaLanding } from 'src/app/ui/modals/landing/nueva-landing.modal';
import { EditarGalaxia } from 'src/app/ui/modals/galaxia/editar-galaxia.modal';
import { EliminarCurso } from 'src/app/ui/modals/curso/eliminar-curso.modal';


export const MODAL_REGISTRY: Record<string, Type<object>> = {
  user: UserModalComponent,
  nuevaCategoria:NuevaCategoria,
  nuevaLanding: NuevaLanding,
  imagenPlaneta: ImagenPlaneta,
  nuevoPlaneta: NuevoPlaneta,
  nuevaGalaxia: NuevaGalaxia,
  editarGalaxia: EditarGalaxia,
  eliminarCurso: EliminarCurso,
};