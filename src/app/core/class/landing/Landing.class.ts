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

  static fromJson(landing: unknown): Landing {
    const casted = landing as Record<string, unknown>;

    return new Landing({
      id: (casted['id'] as string) ?? '',
      titulo: (casted['titulo'] as string) ?? '',
      descripcion: (casted['descripcion'] as string) ?? '',
      imagenPrincipal: (casted['imagenPrincipal'] as string) ?? '',
      contenido: (casted['contenido'] as string[]) ?? [],
      estado: (casted['estado'] as boolean) ?? false,
      slug: (casted['slug'] as string) ?? '',
      metaKeywords: (casted['metaKeywords'] as string) ?? '',
      landingUrl: (casted['landingUrl'] as string) ?? '',
      itemImagenesLanding:
        (casted['itemImagenesLanding'] as LandingImagenItem[]) ?? [],
      itemColores: (casted['itemColores'] as LandingColorItem[]) ?? [],
    });
  }

  static toJson(landing: Landing): unknown {
    return {
      titulo: landing.titulo,
      descripcion: landing.descripcion,
      imagenPrincipal: landing.imagenPrincipal,
      contenido: landing.contenido,
      estado: landing.estado,
      slug: landing.slug,
      metaKeywords: landing.metaKeywords,
      landingUrl: landing.landingUrl,
      itemImagenesLanding: landing.itemImagenesLanding,
      itemColores: landing.itemColores,
    };
  }
}
