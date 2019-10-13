import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioSistema } from '../domain/UsuarioSistema';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http:HttpClient) { }  

  Url = 'http://localhost:8080/ampep/usuariosistema';
  //persona : Persona;
  usuarioSistema: UsuarioSistema;


  getPersonaId(usuario: String, contrasena: String )
  {
    return this.http.get<UsuarioSistema>(this.Url+"/login/"+usuario+'/'+contrasena);
  }

}
