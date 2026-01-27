import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarParametro } from './editar-parametro';

describe('EditarParametro', () => {
  let component: EditarParametro;
  let fixture: ComponentFixture<EditarParametro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarParametro]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditarParametro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
