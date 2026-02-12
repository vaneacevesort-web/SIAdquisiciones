import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleValidadorComponent } from './detalle-validador.component';

describe('DetalleValidadorComponent', () => {
  let component: DetalleValidadorComponent;
  let fixture: ComponentFixture<DetalleValidadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleValidadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleValidadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
