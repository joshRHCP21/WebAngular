import { Component, OnInit,Input , ViewChild, ElementRef} from '@angular/core';
import { RegisterService } from './services/register.service';
import { Router } from '@angular/router';
import { RespuestaServer } from '../signup/domain/RespuestaServer';
import { ValidacionRegistro } from '../signup/domain/ValidacionRegistro';
import { DestinatarioCorreo } from '../signup/domain/DestinatarioCorreo';
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
   private router: Router) { }

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

            var cvurrentdate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" +d.getDate();           

            this.respuestaServer = data;
            console.log(this.respuestaServer.respuestaServer);
            if(this.respuestaServer.estadoRespuestaServer==="1")
            {
              //Generando el envio del codigo de auntenticacion
              this.validacionRegistro.idValidRegUsuario = 0;
              this.validacionRegistro.codModularValRegUsuario = this.codModularColegio.nativeElement.value;
              this.validacionRegistro.dniValRegUsuario = this.dniRepresentante.nativeElement.value;
              this.validacionRegistro.fecRegistrValRegUsuario = cvurrentdate;
              this.validacionRegistro.correoValRegUsuario = this.respuestaServer.respuestaServer;
              this.validacionRegistro.codvaliValRegUsuario = "123456";
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
                    
                    this.destinatarioCorreo.to = this.respuestaServer.respuestaServer;
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
   
  }

  public validarCamposFormulario()
  {
    let arrInputsFormulario = [];
    let inputsVacios = 0;
    arrInputsFormulario = [this.dniRepresentante,this.codModularColegio];

    arrInputsFormulario.forEach((input, index) => {
      console.log(input);
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