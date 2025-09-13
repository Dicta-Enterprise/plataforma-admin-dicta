export class LandingPage {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string[];
  estado: boolean;
  planetaId: string;
  imagenUrl: string;
  color: string;

  constructor(landingPage: Partial<LandingPage> = {}) {
    this.id = landingPage.id ?? '';
    this.titulo = landingPage.titulo ?? '';
    this.descripcion = landingPage.descripcion ?? '';
    this.contenido = landingPage.contenido ?? [];
    this.estado = landingPage.estado ?? true;
    this.planetaId = landingPage.planetaId ?? '';
    this.imagenUrl = landingPage.imagenUrl?.trim() || '';
    this.color = landingPage.color?.trim() || '';
  }

  static fromJson(landingPage: unknown): LandingPage {
    const casted = landingPage as Record<string, unknown>;

    return new LandingPage({
      id: casted['id'] as string,
      titulo: casted['titulo'] as string,
      descripcion: casted['descripcion'] as string,
      contenido: casted['contenido'] as [],
      estado: casted['estado'] as boolean,
      planetaId: casted['planetaId'] as string,
      imagenUrl: casted['imagenUrl'] as string,
      color: casted['color'] as string,
    });
  }

  static toJson(landingPage: LandingPage): unknown {
    return {
      titulo: landingPage.titulo,
      descripcion: landingPage.descripcion,
      contenido: landingPage.contenido,
      estado: landingPage.estado,
      planetaId: landingPage.planetaId,
      imagenUrl: landingPage.imagenUrl,
      color: landingPage.color,
    };
  }
}
