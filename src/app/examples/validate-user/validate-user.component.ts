import { Component, OnInit ,Input , ViewChild, ElementRef} from '@angular/core';
import { RegisterService } from '../register-user/services/register.service';
import { Router } from '@angular/router';
import { ValidacionRegistro } from '../signup/domain/ValidacionRegistro';
import { Colegio } from '../signup/domain/Colegio';
import { UsuarioSistema } from '../signup/domain/UsuarioSistema';
import { TipoUsuario } from '../signup/domain/TipoUsuario';
import {EnviarCorreoRegistroService} from '../register-user/services/enviar-correo-registro.service';
import {DestinatarioCorreo} from '../../examples/signup/domain/DestinatarioCorreo';

@Component({
  selector: 'app-validate-user',
  templateUrl: './validate-user.component.html',
  styleUrls: ['./validate-user.component.scss']
})
export class ValidateUserComponent implements OnInit {

  @Input()
  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;
  destinatarioCorreo: DestinatarioCorreo;

  constructor(private router: Router, 
              private service:RegisterService ,
              private serviceEmail : EnviarCorreoRegistroService, ) { }

  @ViewChild('dniRepresentante') dniRepresentante : ElementRef;
  @ViewChild('codModularColegio') codModularColegio : ElementRef;
  @ViewChild('codAutenticación') codAutenticación : ElementRef;

  mostrarAlerta: boolean = false;
  mensajeAlerta: string = '';
  tipoAlerta: string = '';
  iconoAlerta: string = '';
  validacionRegistro: ValidacionRegistro = null;
  colegio: Colegio;
  usuario : UsuarioSistema;

  ngOnInit() {
    this.inicializarCampos();
    this.destinatarioCorreo = new DestinatarioCorreo();
  }
  
  inicializarCampos()
  {
    var moduloColegio = localStorage.getItem('moduloColegio');
    var dniRepresentanteColegio = localStorage.getItem('dniRepresentanteColegio');
    var correoRepresentanteColegio = localStorage.getItem('correoRepresentanteColegio');

    this.dniRepresentante.nativeElement.value = dniRepresentanteColegio;
    this.codModularColegio.nativeElement.value = moduloColegio;
    this.codAutenticación.nativeElement.value = "";

  }

  validarCuenta()
  {
    let inputVacio = this.validarCamposFormulario();
    if(inputVacio > 0)
    {
      this.alerts.push({
          id: 1,
          type: 'danger',
          message: 'Debe llenar todos los campos.',
          icon: 'nc-bell-55'
      });
      this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
      this.mostrarAlerta = true;     
    }
    else
    {
     console.log(this.dniRepresentante.nativeElement.value,this.codModularColegio.nativeElement.value,this.codAutenticación.nativeElement.value);
     this.service.validateTokenOfRegistration(this.dniRepresentante.nativeElement.value,this.codModularColegio.nativeElement.value,this.codAutenticación.nativeElement.value)
     .subscribe(data=>{
        if(data == null || data == undefined){
          this.alerts.push({
            id: 1,
            type: 'danger',
            message: 'ERROR AL VALIDAR, INTENTE NUEVAMENTE.',
            icon: 'nc-bell-55'
        });
        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
        this.mostrarAlerta = true;  
      }
      if(data !== null && data !== undefined){        
        
        this.validacionRegistro = data;
        
        this.service.getColegioMinedu(this.codModularColegio.nativeElement.value)
        .subscribe(data=>{
          
          if(data == null || data == undefined)
          {
            this.colegio = new Colegio;
          }
          else
          {
            // console.log("--------------");
            // console.log(data);
            // console.log("--------------");
            this.colegio = data;
            this.service.registerColegio(this.colegio)
            .subscribe(data=>{
              
              if(data == null || data == undefined)
              {
                console.log("ERROR");
              }
              else
              {              
                
                
                this.usuario = new UsuarioSistema();
                this.usuario.idTipoUsuSist = new TipoUsuario();
                let correoRep = localStorage.getItem("correoRepresentanteColegio");
                let contransena = localStorage.getItem("codModularColegio");
                this.usuario.idUsusist = 0;
                this.usuario.usuario = correoRep;
                this.usuario.estado  = "1";
                this.usuario.contrasen = contransena;
                this.usuario.idTipoUsuSist.idTipousu = 2;
                
                
                var d = new Date;               
                this.usuario.fechCreac = d;


                this.service.registerUsuario(this.usuario)
                  .subscribe(data=>{
                    if(data == null || data == undefined)
                    {
                      console.log("ERROR");
                    }
                    else
                    { 
                      this.serviceEmail.generateValidationRegister(this.validacionRegistro)
                        .subscribe(data=>{
                            if(data == null || data == undefined)
                            {
                              console.log('ERROR AL ENVIAR CORREO');
                            }
                            if(data !== null && data !== undefined)
                            {
                              console.log("SE GUARDARA ");
                              var mensaje = "Su ususario es : "+this.usuario.usuario;
                              mensaje += "y su contraseña es : "+this.usuario.contrasen;
                              this.destinatarioCorreo.to = this.usuario.usuario;
                              this.destinatarioCorreo.from = 'joseantonioalvino21@gmail.com';
                              this.destinatarioCorreo.subject = 'Credenciales de cuenta';
                              this.destinatarioCorreo.name = mensaje; // ENVIAR EN ESTA SECCION EL CODIGO DE VALIDACION
                              
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
                                  
                                  localStorage.setItem('sesionIniciada',"S");  

                                  window.location.href = 'http://localhost:4200/#/signup';
          
                                }
                              
                              });
          
                            }
                        }); 
                      //alert("Usuario registrado con éxito");
                      //console.log(data);
                     // this.router.navigate(["signup"]);
                    }
                  });
              }
            });
          }
        });

        alert("EXITO AL VALIDAR...");
      }
     });
    }
  }


  public validarCamposFormulario()
  {
    let arrInputsFormulario = [];
    let inputsVacios = 0;
    arrInputsFormulario = [this.dniRepresentante,this.codModularColegio,this.codAutenticación];

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