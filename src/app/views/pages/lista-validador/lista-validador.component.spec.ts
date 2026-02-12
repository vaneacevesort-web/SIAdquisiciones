import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaValidadorComponent } from './lista-validador.component';

describe('ListaValidadorComponent', () => {
  let component: ListaValidadorComponent;
  let fixture: ComponentFixture<ListaValidadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaValidadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaValidadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
