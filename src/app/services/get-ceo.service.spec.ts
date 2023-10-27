import { TestBed } from '@angular/core/testing';

import { GetCEOService } from './get-ceo.service';

describe('GetCEOService', () => {
  let service: GetCEOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCEOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
