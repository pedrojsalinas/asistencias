import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Estudiante } from "app/clases/estudiante/estudiante";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class EstudiantesService {
    estudiantes: Estudiante[];
    onEstudiantesChanged: BehaviorSubject<any>;

    constructor(private afs: AngularFirestore) {
        this.onEstudiantesChanged = new BehaviorSubject([]);
    }

    obtenerEstudiantesPorAsignatura(asignaturaId) {
        const asignatura = this.afs.doc(`asignaturas/${asignaturaId}`).ref;
        const estudianteRef = this.afs
            .collection<Estudiante>("estudiantes", (ref) =>
                ref
                    .where("asignaturas", "array-contains", asignatura)
                    .orderBy("apellidos")
            )
            .snapshotChanges()
            .pipe(
                map((actions) =>
                    actions.map((a) => {
                        const data = a.payload.doc.data() as Estudiante;
                        const id = a.payload.doc.id;
                        return { id, ...data };
                    })
                )
            );
        return new Promise((resolve, reject) => {
            estudianteRef.subscribe((response: any) => {
                this.estudiantes = response;
                console.log(
                    "🚀 ~ file: estudiantes.service.ts ~ line 39 ~ EstudiantesService ~ estudianteRef.subscribe ~ response",
                    response
                );

                this.onEstudiantesChanged.next(this.estudiantes);
                resolve(this.estudiantes);
            }, reject);
        });
    }
}
