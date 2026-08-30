export const IMAGE_UPLOAD_FOLDERS = [
  'categorias',
  'cursos',
  'galaxias',
  'planetas',
] as const;

export type AllowedUploadFolder = (typeof IMAGE_UPLOAD_FOLDERS)[number];

export const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;