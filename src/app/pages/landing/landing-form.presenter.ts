import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';

export type TipoSeccion = 'banner' | 'texto-imagen' | 'beneficios' | 'galeria' | 'video' | 'llamadaAccion';

@Injectable()
export class LandingFormPresenter {
  Form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  createForm() {
    this.Form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      slug: ['', [Validators.required]],
      imagenPrincipal: ['', [Validators.required]],
      estado: [true],
      planetaId: ['', [Validators.required]],
      secciones: this.fb.array([]),
      seo: this.fb.group({
        metaTitle: ['', [Validators.required]],
        metaDescription: ['', [Validators.required]],
        keywords: this.fb.array([]),
      }),
      itemImagenesLanding: this.fb.array([]),
      itemColores: this.fb.array([]),
    });
  }

  get secciones(): FormArray {
    return this.Form.get('secciones') as FormArray;
  }

  get imagenes(): FormArray {
    return this.Form.get('itemImagenesLanding') as FormArray;
  }

  get colores(): FormArray {
    return this.Form.get('itemColores') as FormArray;
  }

  get keywords(): FormArray {
    return this.Form.get('seo.keywords') as FormArray;
  }

  addImagen(url = '') {
    this.imagenes.push(this.fb.group({ url: [url] }));
  }

  addColor(color = '') {
    this.colores.push(this.fb.group({ color: [color] }));
  }

  addKeyword(value = '') {
    this.keywords.push(this.fb.control(value));
  }

  addSeccion(tipo: TipoSeccion) {
    this.secciones.push(this.crearSeccionPorTipo(tipo));
  }

  removeSeccion(index: number) {
    this.secciones.removeAt(index);
  }

  obtenerBotones(seccion: AbstractControl): FormArray {
    return seccion.get('botones') as FormArray;
  }

  obtenerItems(seccion: AbstractControl): FormArray {
    return seccion.get('items') as FormArray;
  }

  obtenerImagenesGaleria(seccion: AbstractControl): FormArray {
    return seccion.get('imagenes') as FormArray;
  }

  addBoton(seccion: AbstractControl, texto = '', url = '') {
    this.obtenerBotones(seccion).push(
      this.fb.group({
        texto: [texto, [Validators.required]],
        url: [url, [Validators.required]],
      })
    );
  }

  removeBoton(seccion: AbstractControl, index: number) {
    this.obtenerBotones(seccion).removeAt(index);
  }
  removeKeyword(index: number) {
    this.keywords.removeAt(index);
  }
  addItem(seccion: AbstractControl, value = '') {
    this.obtenerItems(seccion).push(new FormControl(value, [Validators.required]));
  }

  removeItem(seccion: AbstractControl, index: number) {
    this.obtenerItems(seccion).removeAt(index);
  }

  addImagenGaleria(seccion: AbstractControl, url = '', descripcion = '') {
    this.obtenerImagenesGaleria(seccion).push(
      this.fb.group({
        url: [url, [Validators.required]],
        descripcion: [descripcion],
      })
    );
  }

  removeImagenGaleria(seccion: AbstractControl, index: number) {
    this.obtenerImagenesGaleria(seccion).removeAt(index);
  }

  private crearSeccionPorTipo(tipo: TipoSeccion): FormGroup {
    switch (tipo) {
    case 'banner':
      return this.fb.group({
        tipo: [tipo],
        titulo: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        imagen: this.fb.group({
          url: ['', [Validators.required]],
          alt: [''],
        }),
        botones: this.fb.array([]),
      });
    case 'texto-imagen':
      return this.fb.group({
        tipo: [tipo],
        layout: ['', [Validators.required]],
        titulo: ['', [Validators.required]],
        texto: ['', [Validators.required]],
        imagen: this.fb.group({
          url: ['', [Validators.required]],
          alt: [''],
        }),
      });
    case 'beneficios':
      return this.fb.group({
        tipo: [tipo],
        titulo: ['', [Validators.required]],
        items: this.fb.array([]),
      });
    case 'galeria':
      return this.fb.group({
        tipo: [tipo],
        imagenes: this.fb.array([]),
      });
    case 'video':
      return this.fb.group({
        tipo: [tipo],
        titulo: ['', [Validators.required]],
        url: ['', [Validators.required]],
      });
    case 'llamadaAccion':
      return this.fb.group({
        tipo: [tipo],
        titulo: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        botones: this.fb.array([]),
      });
    }
  }
}