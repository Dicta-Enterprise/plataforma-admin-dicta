import { FormGroup } from '@angular/forms';
import { CreateLandingDto } from '@interfaces/landing/iLanding.dto';

export class LandingMapper {
  static formToCreateDto(form: FormGroup): CreateLandingDto {
    const value = form.value;

    return {
      titulo: value.titulo?.trim(),
      descripcion: value.descripcion?.trim(),
      slug: value.slug?.trim().toLowerCase().replace(/\s+/g, '-'),
      landingUrl: value.landingUrl?.trim(),
      imagenPrincipal: value.imagenPrincipal?.trim(),
      metaKeywords: value.metaKeywords?.trim(),
      estado: value.estado ?? true,

      contenido: (value.contenidoTexto || '')
        .split('\n')
        .map((x: string) => x.trim())
        .filter((x: string) => x),

      itemImagenesLanding: (value.imagenesTexto || '')
        .split('\n')
        .map((x: string) => x.trim())
        .filter((x: string) => x)
        .map((url: string) => ({ url: url })),

      itemColores: (value.coloresTexto || '')
        .split('\n')
        .map((x: string) => x.trim())
        .filter((x: string) => x)
        .map((color: string) => ({ color })),
    };
  }
}