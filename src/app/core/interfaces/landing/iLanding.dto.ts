export interface ItemImagenLandingDto {
  url: string;
}

export interface ItemColorDto {
  color: string;
}

export interface SeoDto {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface BotonDto {
  texto: string;
  url: string;
}

export interface ImagenSeccionDto {
  url: string;
  alt: string;
}

export interface SeccionBannerDto {
  tipo: 'banner';
  titulo: string;
  descripcion: string;
  imagen: ImagenSeccionDto;
  botones: BotonDto[];
}

export interface SeccionTextoImagenDto {
  tipo: 'texto-imagen';
  layout: string;
  titulo: string;
  texto: string;
  imagen: ImagenSeccionDto;
}

export interface SeccionBeneficiosDto {
  tipo: 'beneficios';
  titulo: string;
  items: string[];
}

export interface SeccionGaleriaDto {
  tipo: 'galeria';
  imagenes: { url: string; descripcion: string }[];
}

export interface SeccionVideoDto {
  tipo: 'video';
  titulo: string;
  url: string;
}

export interface SeccionLlamadaAccionDto {
  tipo: 'llamadaAccion';
  titulo: string;
  descripcion: string;
  botones: BotonDto[];
}

export type SeccionDto =
  | SeccionBannerDto
  | SeccionTextoImagenDto
  | SeccionBeneficiosDto
  | SeccionGaleriaDto
  | SeccionVideoDto
  | SeccionLlamadaAccionDto;

export interface CreateLandingDto {
  titulo: string;
  descripcion: string;
  imagenPrincipal: string;
  slug: string;
  estado?: boolean;
  planetaId: string;
  secciones: Record<string, SeccionDto> | SeccionDto[];
  seo: SeoDto;
  itemImagenesLanding: ItemImagenLandingDto[];
  itemColores: ItemColorDto[];
}