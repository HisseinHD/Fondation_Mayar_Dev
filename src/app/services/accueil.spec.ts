import { TestBed } from '@angular/core/testing';

import { Accueil } from './accueil';

describe('Accueil', () => {
  let service: Accueil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Accueil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
