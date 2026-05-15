import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { EstudioMercadoComponent } from './estudio-mercado.component';

describe('EstudioMercadoComponent', () => {
  let component: EstudioMercadoComponent;
  let fixture: ComponentFixture<EstudioMercadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudioMercadoComponent],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EstudioMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});