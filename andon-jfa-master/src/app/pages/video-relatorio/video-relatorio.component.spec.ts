import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRelatorioComponent } from './video-relatorio.component';

describe('VideoRelatorioComponent', () => {
  let component: VideoRelatorioComponent;
  let fixture: ComponentFixture<VideoRelatorioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoRelatorioComponent]
    });
    fixture = TestBed.createComponent(VideoRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
