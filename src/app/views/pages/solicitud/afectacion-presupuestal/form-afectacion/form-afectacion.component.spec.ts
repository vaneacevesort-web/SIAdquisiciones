import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAfectacionComponent } from './form-afectacion.component';

describe('FormAfectacionComponent', () => {
  let component: FormAfectacionComponent;
  let fixture: ComponentFixture<FormAfectacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAfectacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAfectacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
