import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogControleRealizadoComponent } from './dialog-controle-realizado.component';

describe('DialogControleRealizadoComponent', () => {
  let component: DialogControleRealizadoComponent;
  let fixture: ComponentFixture<DialogControleRealizadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogControleRealizadoComponent]
    });
    fixture = TestBed.createComponent(DialogControleRealizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
