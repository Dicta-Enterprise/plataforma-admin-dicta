import { map, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { Curso } from '@class/cursos/Curso.class';
import { CursoFacade } from 'src/app/patterns/facade/curso.facade';
import { CursoService } from 'src/app/core/services/cursos/curso.service';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { MODELS_ENUM } from 'src/app/core/enums/models.enum';
import { NuevoCursoModal } from 'src/app/ui/modals/curso/nuevo-curso.modal';

interface FilterOption {
  label: string;
  value: string;
}

const EMPTY_CATEGORY_VALUE = '__EMPTY_CATEGORY__';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  providers: [CursoFacade, CursoService],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
})
export class Cursos implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  readonly cursos$: Observable<Curso[]>;
  readonly cursosFiltrados$: Observable<Curso[]>;
  readonly categoriasOptions$: Observable<FilterOption[]>;
  readonly precioRango$: Observable<{ min: number | null; max: number | null }>;

  selectedCategoria = '';
  selectedPrecioMin = '';
  selectedPrecioMax = '';

  private readonly categoriaFiltro$ = new BehaviorSubject<string>('');
  private readonly precioMinFiltro$ = new BehaviorSubject<number | null>(null);
  private readonly precioMaxFiltro$ = new BehaviorSubject<number | null>(null);
  private readonly currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  constructor(
    private readonly cursoFacade: CursoFacade,
    private readonly modalService: ModalService
  ) {
    this.cursos$ = this.cursoFacade.cursos$;

    this.categoriasOptions$ = this.cursos$.pipe(
      map((cursos) => {
        const unique = new Set<string>();
        cursos.forEach((curso) => unique.add((curso.categoriaNombre ?? '').trim()));

        const values = Array.from(unique).filter((value) => value !== '');
        values.sort((a, b) => a.localeCompare(b));

        const options: FilterOption[] = [{ label: 'Todas las categorias', value: '' }];
        values.forEach((value) => options.push({ label: value, value }));

        if (unique.has('')) {
          options.push({ label: 'Sin categoria', value: EMPTY_CATEGORY_VALUE });
        }

        return options;
      })
    );

    this.precioRango$ = this.cursos$.pipe(
      map((cursos) => {
        const precios = cursos
          .map((curso) => curso.precio)
          .filter((precio): precio is number => precio !== null && precio !== undefined);

        if (!precios.length) {
          return { min: null, max: null };
        }

        return {
          min: Math.min(...precios),
          max: Math.max(...precios),
        };
      })
    );

    this.cursosFiltrados$ = combineLatest([
      this.cursos$,
      this.categoriaFiltro$,
      this.precioMinFiltro$,
      this.precioMaxFiltro$,
    ]).pipe(
      map(([cursos, categoriaFiltro, precioMin, precioMax]) =>
        cursos.filter((curso) => {
          if (categoriaFiltro) {
            const categoriaActual = (curso.categoriaNombre ?? '').trim();
            if (
              categoriaFiltro === EMPTY_CATEGORY_VALUE
                ? categoriaActual !== ''
                : categoriaActual !== categoriaFiltro
            ) {
              return false;
            }
          }

          const precio = curso.precio;

          if (precioMin !== null && (precio ?? -Infinity) < precioMin) {
            return false;
          }

          if (precioMax !== null && (precio ?? Infinity) > precioMax) {
            return false;
          }

          return true;
        })
      )
    );
  }

  ngOnInit(): void {
    this.cursoFacade.listarCursos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refrescar(): void {
    this.cursoFacade.listarCursos();
  }

  abrirModalNuevoCurso(): void {
    const modalRef = this.modalService.openByName(MODELS_ENUM.NUEVO_CURSO) as
      | ComponentRef<NuevoCursoModal>
      | undefined;

    if (!modalRef) {
      return;
    }

    const savedSub = modalRef.instance.saved.subscribe(() => {
      this.refrescar();
    });

    const closedSub = modalRef.instance.closed.subscribe(() => {
      savedSub.unsubscribe();
      closedSub.unsubscribe();
    });

    this.subscription.add(savedSub);
    this.subscription.add(closedSub);
  }

  cambiarEstado(curso: Curso, estado: boolean): void {
    const sub = this.cursoFacade
      .actualizarEstado(curso.id, estado)
      .pipe(take(1))
      .subscribe();

    this.subscription.add(sub);
  }

  editarCurso(curso: Curso): void {
    console.log('Editar curso', curso);
  }

  onCategoriaFilterChange(value: string): void {
    this.selectedCategoria = value;
    this.categoriaFiltro$.next(value);
  }

  onPrecioRangoChange(min: string, max: string): void {
    this.selectedPrecioMin = min;
    this.selectedPrecioMax = max;

    const minNumber = min !== '' ? Number(min) : null;
    const maxNumber = max !== '' ? Number(max) : null;

    const normalizedMin = minNumber !== null && Number.isNaN(minNumber) ? null : minNumber;
    const normalizedMax = maxNumber !== null && Number.isNaN(maxNumber) ? null : maxNumber;

    this.precioMinFiltro$.next(normalizedMin);
    this.precioMaxFiltro$.next(normalizedMax);
  }
}


