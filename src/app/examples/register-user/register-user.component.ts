import { Component, OnInit,Input , ViewChild, ElementRef} from '@angular/core';
import { RegisterService } from './services/register.service';
import { Router } from '@angular/router';
import { RespuestaServer } from '../signup/domain/RespuestaServer';
import { ValidacionRegistro } from '../signup/domain/ValidacionRegistro';
import { DestinatarioCorreo } from '../signup/domain/DestinatarioCorreo';
import { SignUpService } from '../signup/services/signup.services';
import { EnviarCorreoRegistroService } from './services/enviar-correo-registro.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  @Input()
  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;

  @ViewChild('dniRepresentante') dniRepresentante : ElementRef;
  @ViewChild('codModularColegio') codModularColegio : ElementRef;

  mostrarAlerta: boolean = false;
  mensajeAlerta: string = '';
  tipoAlerta: string = '';
  iconoAlerta: string = '';

  respuestaServer : RespuestaServer;
  destinatarioCorreo : DestinatarioCorreo;
  validacionRegistro : ValidacionRegistro; 

  constructor
  (private service:RegisterService, 
   private serviceEmail : EnviarCorreoRegistroService, 
   private router: Router,
   private serviceSingUp : SignUpService) { }

  ngOnInit() {
    this.respuestaServer = new RespuestaServer();
    this.destinatarioCorreo = new DestinatarioCorreo();
    this.validacionRegistro = new ValidacionRegistro();

    this.alerts.push({
        id: 1,
        type: 'danger',
        message: 'Debe llenar los campos.',
        icon: 'nc-bell-55'
    });
    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
  }
  
  register()
  {
    let inputVacio = this.validarCamposFormulario();

    if(inputVacio > 0)
    {
      this.mostrarAlerta = true;    
    }
    else
    {
      //console.log('consumiendo servicio');
      console.log(this.codModularColegio.nativeElement.value);
      this.service.validateIfIsRegistered(this.codModularColegio.nativeElement.value)
      .subscribe(data=>{
      
        if(data == null )
        {
          alert("Registro correcto");
          this.service.validateSchoolAndRepre(this.dniRepresentante.nativeElement.value,this.codModularColegio.nativeElement.value)
          .subscribe(data=>{
            if(data == null || data == undefined){
              console.log('ERROR');
              this.mostrarAlerta = true;
            }
            if(data !== null && data !== undefined){
                this.mostrarAlerta = false;
                //console.log(data);
    
                //current date var
                var d = new Date();
                var month = d.getMonth() + 1 < 10 ? "0"+d.getMonth() + 1 : d.getMonth() + 1;
                var day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate();
                var cvurrentdate = d.getFullYear() + "-" + month + "-" + day;           
                
                var respuesta = data.respuestaServer;
                var token = respuesta.substr(respuesta.indexOf("|")+1,respuesta.length);
                var correoTo = respuesta.substr(0,respuesta.indexOf("|"));
                this.respuestaServer = data;
    
                console.log(token);
                console.log(correoTo);
                //console.log(this.respuestaServer.respuestaServer);
                if(this.respuestaServer.estadoRespuestaServer==="1")
                {
                  //Generando el envio del codigo de auntenticacion
                  this.validacionRegistro.idValidRegUsuario = 0;
                  this.validacionRegistro.codModularValRegUsuario = this.codModularColegio.nativeElement.value;
                  this.validacionRegistro.dniValRegUsuario = this.dniRepresentante.nativeElement.value;
                  this.validacionRegistro.fecRegistrValRegUsuario = cvurrentdate;
                  this.validacionRegistro.correoValRegUsuario = correoTo;
                  this.validacionRegistro.codvaliValRegUsuario = token;
                  this.validacionRegistro.estadoValRegUsuario = "1";
    
                  console.log(this.validacionRegistro);
    
                  this.serviceEmail.generateValidationRegister(this.validacionRegistro)
                  .subscribe(data=>{
                      if(data == null || data == undefined)
                      {
                        console.log('ERROR AL ENVIAR CORREO');
                      }
                      if(data !== null && data !== undefined)
                      {
                        console.log("SE GUARDARA ");
                        
                        this.destinatarioCorreo.to = correoTo;
                        this.destinatarioCorreo.from = 'joseantonioalvino21@gmail.com';
                        this.destinatarioCorreo.subject = 'Codigo validación plataforma AMPEP';
                        this.destinatarioCorreo.name = this.validacionRegistro.codvaliValRegUsuario; // ENVIAR EN ESTA SECCION EL CODIGO DE VALIDACION
                        
                        console.log(this.destinatarioCorreo);
    
                        this.serviceEmail.sendValidationEmail(this.destinatarioCorreo)
                        .subscribe(data=>{
                        
                          if(data == null || data == undefined)
                          {
                            console.log('ERROR AL ENVIAR CORREO');
                          }
                          if(data !== null && data !== undefined)
                          {
                            console.log("SE GUARDÓ ");
                            localStorage.setItem('moduloColegio',this.validacionRegistro.codModularValRegUsuario+"");
                            localStorage.setItem('dniRepresentanteColegio',this.validacionRegistro.dniValRegUsuario+"");                        
                            localStorage.setItem('correoRepresentanteColegio',this.validacionRegistro.correoValRegUsuario+"");                        
                            window.location.href = 'http://localhost:4200/#/validate-user';
    
                          }
                        
                        });
    
                      }
                  }); 
                }
                else
                {
                  console.log(this.respuestaServer.respuestaServer);
                }
            }
          });

        }
        else if(data !== null && data !== undefined || data)
        {
          alert("CUENTA YA REGISTRADA, POR FAVOR INICIE SESION");
        }
    });
    }
   
  }
    
  public validarRegistroColegio(codModular : String)
  {
    var respuesta = "";
   
  }

  public validarCamposFormulario()
  {
    let arrInputsFormulario = [];
    let inputsVacios = 0;
    arrInputsFormulario = [this.dniRepresentante,this.codModularColegio];

    arrInputsFormulario.forEach((input, index) => {
      //console.log(input);
      if(input.nativeElement.value.trim() === '' || input === undefined)
      { 
        inputsVacios++;
      }
    });

    return inputsVacios;
  }

  public closeAlert(alert: IAlert) {
    this.mostrarAlerta = false;
  
  }


}


export interface IAlert {
  id: number;
  type: string;
  message: string;
  icon?: string;
}