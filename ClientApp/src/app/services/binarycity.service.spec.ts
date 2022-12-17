import { TestBed } from '@angular/core/testing';

import { BinarycityService } from './binarycity.service';

describe('BinarycityService', () => {
  let service: BinarycityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinarycityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
