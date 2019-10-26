import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DestinatarioCorreo } from 'app/examples/signup/domain/DestinatarioCorreo';
import { ValidacionRegistro } from 'app/examples/signup/domain/ValidacionRegistro';

@Injectable({
  providedIn: 'root'
})
export class EnviarCorreoRegistroService {

  constructor(private http:HttpClient) { }

  Url = 'http://localhost:8082/sendingEmail';
  UrlValidacionRegistro = 'http://localhost:8080/ampep/validacionregistro/';

  sendValidationEmail(destinatarioCorreo : DestinatarioCorreo)
  {
    return this.http.post<DestinatarioCorreo>(this.Url,destinatarioCorreo);
  }

  generateValidationRegister(validacionRegistro : ValidacionRegistro)
  {
    return this.http.post<ValidacionRegistro>(this.UrlValidacionRegistro,validacionRegistro);
  }

}
