import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateForma } from './create-forma';

describe('CreateForma', () => {
  let component: CreateForma;
  let fixture: ComponentFixture<CreateForma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateForma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateForma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
