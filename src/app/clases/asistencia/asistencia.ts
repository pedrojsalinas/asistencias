export class Asistencia {
    id: string;
    estudiante: any;
    fecha: any;
    fechaRegistro: any;
    nota: string;

    constructor(asistencia?) {
        asistencia = asistencia || {};
        this.id = asistencia.id || "";
        this.estudiante = asistencia.estudiante || "";
        this.fecha = asistencia.fecha || "";
        this.fechaRegistro = asistencia.fechaRegistro || "";
        this.nota = asistencia.nota || "";
    }
}
