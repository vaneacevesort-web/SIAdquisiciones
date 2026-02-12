import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateValidadorComponent } from './create-validador.component';

describe('CreateValidadorComponent', () => {
  let component: CreateValidadorComponent;
  let fixture: ComponentFixture<CreateValidadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateValidadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateValidadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
