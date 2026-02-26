import { FormArray, FormGroup } from '@angular/forms';
import { CreateGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';

export class GalaxiaMapper {

  private static mapGalaxiaGroupToDto(galaxiaGroup: FormGroup): CreateGalaxiaDto {
    const value = galaxiaGroup.value;

    return {
      nombre: value.nombre,
      tema: value.tema,
      descripcion: value.descripcion,
      imagen: value.imagen,
      url: value.url,
      textura: value.textura,      
      estado: value.estado,
      categoria: typeof value.categoria === 'object'
        ? value.categoria.nombre
        : value.categoria,
      categoriaId: typeof value.categoria === 'object'
        ? value.categoria.id
        : value.categoria,     
      
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

  static formToCreateDtos(form: FormGroup): CreateGalaxiaDto[] {
    const galaxiasArray = form.get('galaxias') as FormArray;

    if (!galaxiasArray) return [];

    return galaxiasArray.controls.map(control =>
      this.mapGalaxiaGroupToDto(control as FormGroup)
    );
  }

  static formToMultipleDto(form: FormGroup) {
    return {
      nombreGlobal: form.get('nombreGlobal')?.value,
      descripcionGlobal: form.get('descripcionGlobal')?.value,
      galaxias: this.formToCreateDtos(form)   // ⭐ ESTA ES LA CLAVE
    };
  }
}