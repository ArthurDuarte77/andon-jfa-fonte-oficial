import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMetaComponent } from './dialog-meta.component';

describe('DialogMetaComponent', () => {
  let component: DialogMetaComponent;
  let fixture: ComponentFixture<DialogMetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogMetaComponent]
    });
    fixture = TestBed.createComponent(DialogMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
