import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCandidats } from './gestion-candidats';

describe('GestionCandidats', () => {
  let component: GestionCandidats;
  let fixture: ComponentFixture<GestionCandidats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCandidats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCandidats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
