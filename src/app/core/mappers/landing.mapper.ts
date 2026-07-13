import { FormGroup } from '@angular/forms';
import { CreateLandingDto, SeoDto, ItemImagenLandingDto, ItemColorDto } from '@interfaces/landing/iLanding.dto';

export class LandingMapper {
  static formToCreateDto(form: FormGroup): CreateLandingDto {
    const value = form.getRawValue();

    const seccionesArray = value.secciones ?? [];
    const secciones = seccionesArray.reduce(
      (acc: Record<string, unknown>, seccion: unknown, index: number) => {
        acc[index] = seccion;
        return acc;
      },
      {}
    ) as unknown as CreateLandingDto['secciones'];

    const seo: SeoDto = {
      metaTitle: value.seo?.metaTitle?.trim() ?? '',
      metaDescription: value.seo?.metaDescription?.trim() ?? '',
      keywords: value.seo?.keywords ?? [],
    };

    const itemImagenesLanding: ItemImagenLandingDto[] =
      value.itemImagenesLanding?.length > 0
        ? value.itemImagenesLanding
        : [{ url: value.imagenPrincipal?.trim() ?? '' }];

    const itemColores: ItemColorDto[] =
      value.itemColores?.length > 0
        ? value.itemColores
        : [{ color: '#000000' }];

    return {
      titulo: value.titulo?.trim(),
      descripcion: value.descripcion?.trim(),
      slug: value.slug?.trim().toLowerCase().replace(/\s+/g, '-'),
      imagenPrincipal: value.imagenPrincipal?.trim(),
      estado: value.estado ?? true,
      planetaId: value.planetaId,
      secciones,
      seo,
      itemImagenesLanding,
      itemColores,
    };
  }
}