import { TestBed } from '@angular/core/testing';

import { Actualite } from './actualite';

describe('Actualite', () => {
  let service: Actualite;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Actualite);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
