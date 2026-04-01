import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Injectable()
export class LandingFormPresenter {
  Form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  createForm() {
    this.Form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      slug: ['', [Validators.required]],
      landingUrl: ['', [Validators.required]],
      imagenPrincipal: ['', [Validators.required]],
      metaKeywords: ['', [Validators.required, Validators.minLength(3)]],
      estado: [true],

      contenidoTexto: [''],
      imagenesTexto: [''],
      coloresTexto: [''],
    });
  }

  get contenido(): FormArray {
    return this.Form.get('contenido') as FormArray;
  }

  get imagenes(): FormArray {
    return this.Form.get('itemImagenesLanding') as FormArray;
  }

  get colores(): FormArray {
    return this.Form.get('itemColores') as FormArray;
  }

  addContenido(value = '') {
    this.contenido.push(this.fb.control(value));
  }

  addImagen(url = '') {
    this.imagenes.push(this.fb.group({ url: [url] }));
  }

  addColor(color = '') {
    this.colores.push(this.fb.group({ color: [color] }));
  }
}