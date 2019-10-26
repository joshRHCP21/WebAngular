import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RespuestaServer } from '../../signup/domain/RespuestaServer';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  Url = 'http://localhost:8081/minedu/colegios/validar';
  
  validateSchoolAndRepre(dni: String, codModular: String )
  {
    return this.http.get<RespuestaServer>(this.Url+"/"+codModular+"/"+dni);
  }
 
}
