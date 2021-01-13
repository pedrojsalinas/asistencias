export class Asignatura {
    id: string;
    nombre: string;
    paralelo: string;
    aula: string;
    imagen?: string;
    horario: string[];
    ciclo: string;
    fechaCreacion: any;
    profesor: any;
    constructor(asignatura?) {
        asignatura = asignatura || {};
        this.id = asignatura.id || "";
        this.nombre = asignatura.nombre || "";
        this.paralelo = asignatura.paralelo || "";
        this.aula = asignatura.aula || "";
        this.horario = asignatura.horario || "";
        this.ciclo = asignatura.ciclo || "";
        this.fechaCreacion = asignatura.fechaCreacion || "";
        this.profesor = asignatura.profesor || "";
        this.imagen =
            asignatura.imagen ||
            "https://748073e22e8db794416a-cc51ef6b37841580002827d4d94d19b6.ssl.cf3.rackcdn.com/not-found.png";
    }
}
