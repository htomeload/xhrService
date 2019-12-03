import { TestBed } from '@angular/core/testing';

import { XhrService } from './xhr.service';

describe('XhrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XhrService = TestBed.get(XhrService);
    expect(service).toBeTruthy();
  });
});
