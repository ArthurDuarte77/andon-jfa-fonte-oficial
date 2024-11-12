import { TestBed } from '@angular/core/testing';

import { NodemcuService } from './nodemcu.service';

describe('NodemcuService', () => {
  let service: NodemcuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodemcuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
