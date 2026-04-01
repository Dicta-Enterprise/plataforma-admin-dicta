export interface ItemImagenLandingDto {
  url: string;
}

export interface ItemColorDto {
  color: string;
}

export interface CreateLandingDto {
  titulo: string;
  descripcion: string;
  imagenPrincipal: string;
  contenido: string[];
  estado?: boolean;
  slug: string;
  metaKeywords: string;
  landingUrl: string;
  itemImagenesLanding: ItemImagenLandingDto[];
  itemColores: ItemColorDto[];
}