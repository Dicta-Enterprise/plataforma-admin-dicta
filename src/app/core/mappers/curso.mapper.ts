import { FormGroup } from '@angular/forms';
import { Curso } from '@class/cursos/Curso.class';
import { CursoFormValue } from 'src/app/pages/cursos/cursos-form.presenter';

export class CursoMapper {
  static formToPayload(form: FormGroup): Partial<Curso> {
    const rawValue = form.getRawValue() as CursoFormValue;

    const precio = CursoMapper.toNumber(rawValue?.precio);
    const fechaInicio = CursoMapper.toDate(rawValue?.fechaInicio);
    const duracionSemanas = CursoMapper.toNumber(rawValue?.duracion?.cantidad);
    const beneficios = CursoMapper.mapBeneficios(rawValue?.beneficios ?? null);
    const imagen = (rawValue?.imagen ?? '').trim();

    return {
      nombre: rawValue?.nombre ?? '',
      descripcion: rawValue?.descripcion ?? '',
      categoriaId: rawValue?.categoriaId ?? '',
      profesorId: rawValue?.profesorId ?? '',
      beneficios,
      imagen,
      precio,
      fechaInicio,
      duracionSemanas,
    } as Partial<Curso>;
  }

  private static mapBeneficios(
    beneficios: string | { titulo: string; descripcion: string }[] | null
  ): { titulo: string; descripcion: string }[] {
    if (Array.isArray(beneficios)) {
      return beneficios.map((beneficio) => ({
        titulo: beneficio.titulo,
        descripcion: beneficio.descripcion,
      }));
    }

    if (!beneficios) {
      return [];
    }

    return beneficios
      .split(',')
      .map((beneficio) => beneficio.trim())
      .filter((beneficio) => beneficio.length)
      .map((beneficio) => ({ titulo: beneficio, descripcion: beneficio }));
  }

  private static toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private static toDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
