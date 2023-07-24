import { TestBed } from '@angular/core/testing';

import { Formatter } from './formatter';

describe('Formatter', () => {
  let service: Formatter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formatter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
