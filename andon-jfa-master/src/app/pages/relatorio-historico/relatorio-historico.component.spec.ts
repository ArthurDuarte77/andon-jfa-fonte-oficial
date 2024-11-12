import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioHistoricoComponent } from './relatorio-historico.component';

describe('RelatorioHistoricoComponent', () => {
  let component: RelatorioHistoricoComponent;
  let fixture: ComponentFixture<RelatorioHistoricoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioHistoricoComponent]
    });
    fixture = TestBed.createComponent(RelatorioHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
