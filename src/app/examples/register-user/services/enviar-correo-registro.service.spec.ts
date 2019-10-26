import { TestBed } from '@angular/core/testing';

import { EnviarCorreoRegistroService } from './enviar-correo-registro.service';

describe('EnviarCorreoRegistroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnviarCorreoRegistroService = TestBed.get(EnviarCorreoRegistroService);
    expect(service).toBeTruthy();
  });
});
