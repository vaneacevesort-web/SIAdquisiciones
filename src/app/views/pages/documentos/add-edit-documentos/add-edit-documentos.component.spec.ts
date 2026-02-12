import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocumentosComponent } from './add-edit-documentos.component';

describe('AddEditDocumentosComponent', () => {
  let component: AddEditDocumentosComponent;
  let fixture: ComponentFixture<AddEditDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
