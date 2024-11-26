import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChartComponent } from './dialog-chart.component';

describe('DialogChartComponent', () => {
  let component: DialogChartComponent;
  let fixture: ComponentFixture<DialogChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
