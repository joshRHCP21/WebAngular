import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RespuestaServer } from '../../signup/domain/RespuestaServer';
import { ValidacionRegistro } from '../../signup/domain/ValidacionRegistro';
import { Colegio } from 'app/examples/signup/domain/Colegio';
import { UsuarioSistema } from 'app/examples/signup/domain/UsuarioSistema';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  //Variables Url para los servicios
  Urla = 'http://localhost:8081/minedu/colegios/validar';
  Urlb = 'http://localhost:8080/ampep/validacionregistro';
  Urlc = 'http://localhost:8081/minedu/colegios/obtener';
  Urld = 'http://localhost:8080/ampep/colegios';
  
  validateSchoolAndRepre(dni: String, codModular: String )
  {
    return this.http.get<RespuestaServer>(this.Urla+"/"+codModular+"/"+dni);
  }

  validateTokenOfRegistration(dni: String, codModular: String , validacionToken : String)
  {
    return this.http.get<ValidacionRegistro>(this.Urlb+"/"+codModular+"/"+dni+"/"+validacionToken);
  }

  getColegioMinedu(codModular:String)
  {
    return this.http.get<Colegio>(this.Urlc+"/"+codModular);
  }

  registerColegio(colegio:Colegio)
  {
    return this.http.post<any>(this.Urld,colegio);
  }

  validateIfIsRegistered(codModular: String )
  {
    let urlService  = "http://localhost:8080/ampep/colegios/validar";
    return this.http.get<any>(urlService+"/"+codModular);    
  }
  registerUsuario(usuario : UsuarioSistema)
  {
    let urlService  = "http://localhost:8080/ampep/usuariosistema/";
    return this.http.post<UsuarioSistema>(urlService,usuario); 
  }
}
