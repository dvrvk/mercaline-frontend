import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectGuardGuard } from './redirect-guard.guard';

describe('redirectGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redirectGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
