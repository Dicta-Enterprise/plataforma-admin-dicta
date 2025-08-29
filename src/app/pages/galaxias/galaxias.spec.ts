import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Galaxias } from './galaxias';

describe('Galaxias', () => {
  let component: Galaxias;
  let fixture: ComponentFixture<Galaxias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Galaxias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Galaxias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
