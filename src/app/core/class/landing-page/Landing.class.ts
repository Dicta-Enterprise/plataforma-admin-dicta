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

  static fromJson(landingPage: any): LandingPage {
    return new LandingPage({
      id: landingPage.id,
      titulo: landingPage.titulo,
      descripcion: landingPage.descripcion,
      contenido: landingPage.contenido,
      estado: landingPage.estado,
      planetaId: landingPage.planetaId,
      imagenUrl: landingPage.imagenUrl,
      color: landingPage.color,
    });
  }

  static toJson(landingPage: LandingPage): any {
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
