import { Component, OnInit, Input } from '@angular/core';
import { SignUpService } from './services/signup.services';
import { Router } from '@angular/router';
import { UsuarioSistema } from './domain/UsuarioSistema';
import { TipoUsuario } from './domain/TipoUsuario';
import { store } from '@angular/core/src/render3';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    @Input()
    public alerts: Array<IAlert> = [];
    private backup: Array<IAlert>;

    test : Date = new Date();

    usuarioSistema: UsuarioSistema;

    focus;
    focus1;

    clave: string;
    usuarioa: string;
    mostrarAlerta: boolean = false;



    constructor(private service:SignUpService, private router: Router) { }

    ngOnInit() {

        this.usuarioSistema = new UsuarioSistema();



        this.alerts.push({
            id: 1,
            type: 'danger',
            message: 'Usuario o clave incorrectos',
            icon: 'nc-bell-55'
        });
        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));


    }


    login(){
        this.service.getPersonaId(this.usuarioSistema.usuario, this.usuarioSistema.contrasen)
        .subscribe(data=>{
            if(data == null || data == undefined){
                console.log('ERROR');
                this.mostrarAlerta = true;
            }
            if(data !== null && data !== undefined){
                this.mostrarAlerta = false;
                this.usuarioSistema=data;
                console.log(data);
                localStorage.setItem("tipoUsuario",data.idTipoUsuSist.idTipousu+"");
                window.location.href = 'http://localhost:4201/#/';
                alert('Usuario correcto');
            }
        });
    }

    //Dashboard = 4200
    //Client    = 4201

    public closeAlert(alert: IAlert) {
        // const index: number = this.alerts.indexOf(alert);
        // this.alerts.splice(index, 1);

        this.mostrarAlerta = false;

    }


}


export interface IAlert {
    id: number;
    type: string;
    message: string;
    icon?: string;
}
