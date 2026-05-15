import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAfectacionComponent } from './lista-afectacion.component';

describe('ListaAfectacionComponent', () => {
  let component: ListaAfectacionComponent;
  let fixture: ComponentFixture<ListaAfectacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAfectacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAfectacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
