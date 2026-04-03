import { FormArray, FormGroup } from '@angular/forms';
import { CreatePlanetaDto, CreateMultiplesPlanetaDto } from '@interfaces/interfaces';
import { Planeta } from '@class/planetas/Planeta.class';

export class PlanetaMapper {

  private static mapPlanetaGroupToDto(planetaGroup: FormGroup, rootNombre: string | null): CreatePlanetaDto {
    const datos = planetaGroup.get('datos')?.value;
    const info = planetaGroup.get('info')?.value;
    const peligros = planetaGroup.get('peligros')?.value ?? [];
    const beneficios = planetaGroup.get('beneficios')?.value ?? [];

    return {      
      nombre: rootNombre ?? '',
      codigo: datos.codigo ?? '',
      categoria: datos.categoria, 
      galaxia: typeof datos.galaxia === 'object'
        ? datos.galaxia.nombre
        : datos.galaxia,
      galaxiaId: typeof datos.galaxia === 'object'
        ? datos.galaxia.id
        : datos.galaxiaId,
      textura: datos.textura ?? '',
      url: datos.url ?? '',
      imagenResumen: datos.imagenResumen ?? '',
      resumenCurso: datos.resumenCurso ?? '',
      estado: datos.estado === false ? 'INACTIVO' : 'ACTIVO',      
      info,
      peligros,
      beneficios
    };
  }

  static domainToCreateDto(planeta: Planeta): CreatePlanetaDto {
    return {
      nombre: planeta.nombre,
      codigo: planeta.codigo,
      categoria: planeta.categoria,
      galaxia: planeta.galaxia,
      galaxiaId: planeta.galaxiaId,
      textura: planeta.textura,
      url: planeta.url,
      imagenResumen: planeta.imagenResumen,
      resumenCurso: planeta.resumenCurso,
      estado: planeta.estado,
      info: planeta.info,
      peligros: planeta.peligros,
      beneficios: planeta.beneficios
    };
  } 

  static formToCreateDtos(form: FormGroup): CreatePlanetaDto[] {
    const rootNombre = form.get('nombre')?.value ?? '';
    const planetasArray = form.get('planetas') as FormArray;

    if (!planetasArray) return [];

    return planetasArray.controls.map((fg) =>
      PlanetaMapper.mapPlanetaGroupToDto(fg as FormGroup, rootNombre)
    );
  }
  
  static guardarPlanetasMultiples(form: FormGroup): CreateMultiplesPlanetaDto {
    return {
      planetas: this.formToCreateDtos(form)
    };
  }
}