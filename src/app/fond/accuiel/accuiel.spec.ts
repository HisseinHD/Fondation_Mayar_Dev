import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accuiel } from './accuiel';

describe('Accuiel', () => {
  let component: Accuiel;
  let fixture: ComponentFixture<Accuiel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accuiel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Accuiel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
