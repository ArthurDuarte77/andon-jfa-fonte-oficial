import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeralCicloComponent } from './geral-ciclo.component';

describe('GeralCicloComponent', () => {
  let component: GeralCicloComponent;
  let fixture: ComponentFixture<GeralCicloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeralCicloComponent]
    });
    fixture = TestBed.createComponent(GeralCicloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
