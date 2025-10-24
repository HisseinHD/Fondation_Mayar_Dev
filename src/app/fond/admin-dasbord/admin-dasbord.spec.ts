import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDasbord } from './admin-dasbord';

describe('AdminDasbord', () => {
  let component: AdminDasbord;
  let fixture: ComponentFixture<AdminDasbord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDasbord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDasbord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
