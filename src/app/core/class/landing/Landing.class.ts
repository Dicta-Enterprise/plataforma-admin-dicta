import { CreateLandingDto, ItemColorDto, ItemImagenLandingDto } from '@interfaces/landing/iLanding.dto';

export interface LandingImagenItem {
  url: string;
}


export interface LandingColorItem {
  color: string;
}

export class Landing {
  id: string;
  titulo: string;
  descripcion: string;
  imagenPrincipal: string;
  contenido: string[];
  estado: boolean;
  slug: string;
  metaKeywords: string;
  landingUrl: string;
  itemImagenesLanding: LandingImagenItem[];
  itemColores: LandingColorItem[];
  

  constructor(landing: Partial<Landing> = {}) {
    this.id = landing.id ?? '';
    this.titulo = landing.titulo ?? '';
    this.descripcion = landing.descripcion ?? '';
    this.imagenPrincipal = landing.imagenPrincipal ?? '';
    this.contenido = landing.contenido ?? [];
    this.estado = landing.estado ?? true;
    this.slug = landing.slug ?? '';
    this.metaKeywords = landing.metaKeywords ?? '';
    this.landingUrl = landing.landingUrl ?? '';
    this.itemImagenesLanding = landing.itemImagenesLanding ?? [];
    this.itemColores = landing.itemColores ?? [];
  }  

  static fromJson(dto: CreateLandingDto & { id?: string }): Landing {
    return new Landing({
      id: dto.id,
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      imagenPrincipal: dto.imagenPrincipal,
      contenido: dto.contenido,
      estado: dto.estado,
      slug: dto.slug,
      metaKeywords: dto.metaKeywords,
      landingUrl: dto.landingUrl,

      itemImagenesLanding: (dto.itemImagenesLanding ?? []).map((img: ItemImagenLandingDto) => ({
        url: img.url
      })),

      itemColores: (dto.itemColores ?? []).map((col: ItemColorDto) => ({
        color: col.color
      })),
    });
  }  

  static toJson(landing: Landing): CreateLandingDto {
    return {
      titulo: landing.titulo,
      descripcion: landing.descripcion,
      imagenPrincipal: landing.imagenPrincipal,
      contenido: landing.contenido,
      estado: landing.estado,
      slug: landing.slug,
      metaKeywords: landing.metaKeywords,
      landingUrl: landing.landingUrl,
      itemImagenesLanding: landing.itemImagenesLanding.map(img => ({
        url: img.url
      })),

      itemColores: landing.itemColores.map(col => ({
        color: col.color
      })),
    };
  }
}

