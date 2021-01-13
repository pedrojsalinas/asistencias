export class Usuario {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    
    constructor(usuario?) {
        usuario = usuario || {};
        this.id = usuario.id || "";
        this.nombres = usuario.nombres || "";
        this.apellidos = usuario.apellidos || "";
        this.correo = usuario.correo || "";
    }
}
