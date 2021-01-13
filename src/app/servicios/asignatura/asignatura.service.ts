import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Asignatura } from "app/clases/asignatura/asignatura";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { map } from "rxjs/operators";
@Injectable({
    providedIn: "root",
})
export class AsignaturaService {
    onAsignaturaChanged: BehaviorSubject<any>;
    asignatura: Asignatura;
    constructor(private afs: AngularFirestore) {
        this.onAsignaturaChanged = new BehaviorSubject({});
    }

    obtenerAsignatura(asignaturaId): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs
                .doc<Asignatura>(`asignaturas/${asignaturaId}`)
                .snapshotChanges()
                .pipe(
                    map((a) => {
                        const data = a.payload.data() as Asignatura;
                        const id = a.payload.id;
                        return { id, ...data };
                    })
                )
                .subscribe((response: any) => {
                    this.asignatura = response;
                    this.onAsignaturaChanged.next(this.asignatura);
                    resolve(response);
                }, reject);
        });
    }
}
