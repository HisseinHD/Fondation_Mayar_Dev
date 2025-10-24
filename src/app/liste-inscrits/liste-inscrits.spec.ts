import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeInscrits } from './liste-inscrits';

describe('ListeInscrits', () => {
  let component: ListeInscrits;
  let fixture: ComponentFixture<ListeInscrits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeInscrits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeInscrits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
