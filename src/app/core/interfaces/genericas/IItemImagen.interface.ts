export class ItemImagen {
  file: File;
  categoria: string;
  url: string;

  constructor(itemImagen: Partial<ItemImagen> = {}) {
    this.file = itemImagen.file ?? new File([], '');
    this.categoria = itemImagen.categoria ?? '';
    this.url = itemImagen.url ?? '';
  }

  static fromJson(itemImagen: any): ItemImagen {
    return new ItemImagen({
      file: itemImagen.file,
      categoria: itemImagen.categoria,
      url: itemImagen.url,
    });
  }

  static toJson(itemImagen: ItemImagen): any {
    return {
      file: itemImagen.file,
      categoria: itemImagen.categoria,
      url: itemImagen.url,
    };
  }
}
