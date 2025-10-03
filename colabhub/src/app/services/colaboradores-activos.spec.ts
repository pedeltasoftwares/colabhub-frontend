import { TestBed } from '@angular/core/testing';

import { ColaboradorActivo } from './colaboradores-activos.service';

describe('Colaboradores', () => {
  let service: ColaboradorActivo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColaboradorActivo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
