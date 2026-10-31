export const IMAGE_UPLOAD_FOLDERS = [
  'categorias',
  'cursos',
  'galaxias',
  'planetas',
] as const;

export type AllowedUploadFolder = (typeof IMAGE_UPLOAD_FOLDERS)[number];

// Regla de imágenes (misma que valida la API): solo WebP y máximo 80 KB.
export const SUPPORTED_IMAGE_EXTENSIONS = ['.webp'] as const;
export const MAX_IMAGE_SIZE_KB = 80;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

// Las texturas (galaxias/planetas) van más comprimidas: máximo 50 KB.
export const MAX_TEXTURE_SIZE_KB = 50;
export const MAX_TEXTURE_SIZE_BYTES = MAX_TEXTURE_SIZE_KB * 1024;