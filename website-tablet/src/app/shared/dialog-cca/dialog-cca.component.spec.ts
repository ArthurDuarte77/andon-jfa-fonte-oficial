import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCcaComponent } from './dialog-cca.component';

describe('DialogCcaComponent', () => {
  let component: DialogCcaComponent;
  let fixture: ComponentFixture<DialogCcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
