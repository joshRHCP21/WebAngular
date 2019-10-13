import { Component, OnInit } from '@angular/core';
import { SignUpService } from './services/signup.services';
import { Router } from '@angular/router';
import { UsuarioSistema } from './domain/UsuarioSistema';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    test : Date = new Date();

    usuarioSistema: UsuarioSistema;

    focus;
    focus1;

    clave: string;
    usuarioa: string;



    constructor(private service:SignUpService, private router: Router) { }

    ngOnInit() {

        this.usuarioSistema = new UsuarioSistema();

    }


    login(){

        this.service.getPersonaId(this.usuarioSistema.usuario, this.usuarioSistema.contrasen)
        .subscribe(data=>{

            if(data == null || data == undefined){
                console.log('ERROR');
            }
        
            if(data !== null && data !== undefined){
                this.usuarioSistema=data;
                console.log('EXITO');
                console.log(this.usuarioSistema);
            }

          
        })

    }


}
