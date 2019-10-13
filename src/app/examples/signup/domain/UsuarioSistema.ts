import { TipoUsuario } from "./TipoUsuario";


export class UsuarioSistema
{
    id :number;
    name : String;
    apellidos: String;

    idUsusist: number;
    fechCreac: Date;
    usuario: String;
    fecIniciacc: Date;
    horIniciacc: Date;
    fecFinacc: Date;
    horFinacc: Date;
    contrasen: String;
    estado: String;
    idPersona: number;
    idTipoUsuSist: TipoUsuario;

}
