import {
  CreateLandingDto,
  ItemColorDto,
  ItemImagenLandingDto,
  SeccionDto,
  SeoDto,
} from '@interfaces/landing/iLanding.dto';

export class Landing {
  id: string;
  titulo: string;
  descripcion: string;
  imagenPrincipal: string;
  slug: string;
  estado: boolean;
  planetaId: string;
  secciones: SeccionDto[];
  seo: SeoDto;
  itemImagenesLanding: ItemImagenLandingDto[];
  itemColores: ItemColorDto[];
  fechaCreacion?: string;

  constructor(landing: Partial<Landing> = {}) {
    this.id = landing.id ?? '';
    this.titulo = landing.titulo ?? '';
    this.descripcion = landing.descripcion ?? '';
    this.imagenPrincipal = landing.imagenPrincipal ?? '';
    this.slug = landing.slug ?? '';
    this.estado = landing.estado ?? true;
    this.planetaId = landing.planetaId ?? '';
    this.secciones = landing.secciones ?? [];
    this.seo = landing.seo ?? { metaTitle: '', metaDescription: '', keywords: [] };
    this.itemImagenesLanding = landing.itemImagenesLanding ?? [];
    this.itemColores = landing.itemColores ?? [];
    this.fechaCreacion = landing.fechaCreacion;
  }

  static fromJson(dto: CreateLandingDto & { id?: string; fechaCreacion?: string }): Landing {
    return new Landing({
      id: dto.id ?? '',
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      imagenPrincipal: dto.imagenPrincipal,
      slug: dto.slug,
      estado: dto.estado ?? true,
      planetaId: dto.planetaId,
      secciones: (dto.secciones as SeccionDto[]) ?? [],
      seo: dto.seo ?? { metaTitle: '', metaDescription: '', keywords: [] },
      itemImagenesLanding: (dto.itemImagenesLanding ?? []).map((img: ItemImagenLandingDto) => ({
        url: img.url,
      })),
      itemColores: (dto.itemColores ?? []).map((col: ItemColorDto) => ({
        color: col.color,
      })),
      fechaCreacion: dto.fechaCreacion,
    });
  }

  static toJson(landing: Landing): CreateLandingDto {
    return {
      titulo: landing.titulo,
      descripcion: landing.descripcion,
      imagenPrincipal: landing.imagenPrincipal,
      slug: landing.slug,
      estado: landing.estado,
      planetaId: landing.planetaId,
      secciones: Array.isArray(landing.secciones)
        ? landing.secciones
        : Object.values(landing.secciones ?? {}),
      seo: landing.seo,
      itemImagenesLanding: landing.itemImagenesLanding.map(img => ({
        url: img.url,
      })),
      itemColores: landing.itemColores.map(col => ({
        color: col.color,
      })),
    };
  }
};
