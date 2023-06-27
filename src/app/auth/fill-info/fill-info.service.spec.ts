import { TestBed } from '@angular/core/testing';

import { FillInfoService } from './fill-info.service';

describe('FillInfoService', () => {
  let service: FillInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FillInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
