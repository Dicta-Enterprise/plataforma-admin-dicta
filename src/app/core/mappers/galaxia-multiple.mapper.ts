import { FormArray, FormGroup } from '@angular/forms';
import { CreateGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';

export class GalaxiaMultipleMapper {

  private static mapGalaxiaGroupToDto(galaxiaGroup: FormGroup): CreateGalaxiaDto {
    const value = galaxiaGroup.value;

    return {
      nombre: value.nombre,
      descripcion: value.descripcion,
      imagen: value.imagen,
      url: value.url,
      textura: value.textura,
      estado: value.estado,
      tema: value.tema,
      categoriaId: value.categoria.id,

      color: value.color,
      posicion: {
        x: Number(value.posicion?.x ?? 0),
        y: Number(value.posicion?.y ?? 0),
        z: Number(value.posicion?.z ?? 0),
      },

      rotacion: {
        x: Number(value.rotacion?.x ?? 0),
        y: Number(value.rotacion?.y ?? 0),
        z: Number(value.rotacion?.z ?? 0),
      }
    };
  }

  static formToCreateDto(form: FormGroup): CreateGalaxiaDto | null {
    const galaxiasArray = form.get('galaxias') as FormArray;
    if (!galaxiasArray || galaxiasArray.length === 0) return null;

    const group = galaxiasArray.at(0) as FormGroup;
    return this.mapGalaxiaGroupToDto(group);
  }

  static formToCreateMultiplesDto(form: FormGroup): { galaxias: CreateGalaxiaDto[] } {
    const galaxiasArray = form.get('galaxias') as FormArray;
    const rootNombre = form.get('nombreComun')?.value ?? '';

    if (!galaxiasArray) {
      return { galaxias: [] };
    }

    return {
      galaxias: galaxiasArray.controls.map(control => {
        const dto = this.mapGalaxiaGroupToDto(control as FormGroup);

        return {
          ...dto,
          nombre: rootNombre
        };
      })
    };
  }
}