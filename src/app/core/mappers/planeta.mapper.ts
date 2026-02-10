import { FormGroup } from '@angular/forms';
import { Planeta } from '@class/planetas/Planeta.class';
import { IPlanetaDto } from '@interfaces/interfaces';

export class PlanetaMapper {
  static planetaToJson(
    nuevoPlanetaForm: FormGroup,
    idPlaneta = ''
  ): Planeta {
    const planeta = new Planeta({
      id: idPlaneta,
      nombre: nuevoPlanetaForm.get('nombre')?.getRawValue(),
      categoria: nuevoPlanetaForm.get('categoria')?.getRawValue(),
      resumenCurso: nuevoPlanetaForm.get('resumenCurso')?.getRawValue(),
      imagen: nuevoPlanetaForm.get('imagen')?.getRawValue(),
      estado: true,
      galaxiaId: nuevoPlanetaForm.get('galaxiaId')?.getRawValue(),
      galaxia: nuevoPlanetaForm.get('galaxia')?.getRawValue(),      
    });

    return planeta;
  }
}


