import { FormGroup } from '@angular/forms';
import { Categoria } from '@class/categoria/Categoria.class';

export class CategoriaMapper {
  static categoriaToJson(
    nuevaCategoriaForm: FormGroup,
    idCategoria = ''
  ): Categoria {
    const categoria = new Categoria({
      id: idCategoria,
      nombre: nuevaCategoriaForm.get('nombre')?.getRawValue(),
      descripcion: nuevaCategoriaForm.get('descripcion')?.getRawValue(),
      estado: true,
      imagenUrl: nuevaCategoriaForm.get('imagenUrl')?.getRawValue(),
    });

    return Categoria.toJson(categoria);
  }
}
