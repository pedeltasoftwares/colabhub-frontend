import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmoDashboard } from './pmo-dashboard';

describe('PmoDashboard', () => {
  let component: PmoDashboard;
  let fixture: ComponentFixture<PmoDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmoDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmoDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
