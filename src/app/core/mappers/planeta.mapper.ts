import { FormArray, FormGroup } from '@angular/forms';
import { CreatePlanetaDto } from '@interfaces/interfaces';
import { Planeta } from '@class/planetas/Planeta.class';
import { Categoria } from '@class/categoria/Categoria.class';

export class PlanetaMapper {

  private static mapPlanetaGroupToDto(planetaGroup: FormGroup, rootNombre: string | null) {
    const datos = planetaGroup.get('datos')?.value;
    const info = planetaGroup.get('info')?.value;
    const peligros = planetaGroup.get('peligros')?.value ?? [];
    const beneficios = planetaGroup.get('beneficios')?.value ?? [];

    return {      
      nombre: rootNombre ?? '',
      categoria: datos.categoria ?? '', 
      galaxia: typeof datos.galaxia === 'object'
        ? datos.galaxia.nombre
        : datos.galaxia,
      textura: datos.textura ?? '',
      url: datos.url ?? '',
      imagenResumen: datos.imagen ?? '',
      resumenCurso: datos.resumenCurso ?? '',
      estado: datos.estado === false ? 'INACTIVO' : 'ACTIVO',
      galaxiaId: typeof datos.galaxia === 'object'
        ? datos.galaxia.id
        : datos.galaxia,
      info,
      peligros,
      beneficios
    };
  }

  static formToCreateDtos(form: FormGroup): any[] {
    const rootNombre = form.get('nombre')?.value ?? '';
    const planetasArray = form.get('planetas') as FormArray | null;

    if (!planetasArray) return [];

    return planetasArray.controls.map((fg) =>
      PlanetaMapper.mapPlanetaGroupToDto(fg as FormGroup, rootNombre)
    );
  }

  static domainToCreateDto(planeta: Planeta): any {
    return {
      nombre: planeta.nombre,
      categoria: planeta.categoria,
      resumenCurso: planeta.resumenCurso,
      imagenResumen: planeta.imagen,
      estado: planeta.estado,
      galaxiaId: planeta.galaxiaId,
      galaxia: planeta.galaxia,
      textura: planeta.textura,
      url: planeta.url,
      info: planeta.info,
      peligros: planeta.peligros,
      beneficios: planeta.beneficios
    };
  }
}
