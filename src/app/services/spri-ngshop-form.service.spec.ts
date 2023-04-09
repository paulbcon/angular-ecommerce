import { TestBed } from '@angular/core/testing';

import { SpriNGShopFormService } from './spri-ngshop-form.service';

describe('SpriNGShopFormService', () => {
  let service: SpriNGShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpriNGShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
