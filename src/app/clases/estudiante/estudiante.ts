export class Estudiante {
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    asignaturas: any[];

    constructor(usuario?) {
        usuario = usuario || {};
        this.id = usuario.id || "";
        this.nombres = usuario.nombres || "";
        this.apellidos = usuario.apellidos || "";
        this.correo = usuario.correo || "";
        this.asignaturas = usuario.asignaturas || "";
    }
}
