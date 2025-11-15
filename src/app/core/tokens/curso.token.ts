import { InjectionToken } from '@angular/core';
import { CursoRepository } from 'src/app/repositories/curso.repository';

export const CURSO_REPOSITORY = new InjectionToken<CursoRepository>('CURSO_REPOSITORY');

