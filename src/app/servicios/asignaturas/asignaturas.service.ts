import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from "@angular/router";
import { Asignatura } from "app/clases/asignatura/asignatura";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: "root",
})
export class AsignaturasService implements Resolve<any> {
    asignaturas: Asignatura[];
    onAsignaturasChanged: BehaviorSubject<any>;
    userId: string;

    constructor(
        private afs: AngularFirestore,
        private authService: AuthService
    ) {
        this.onAsignaturasChanged = new BehaviorSubject([]);
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            const userId = this.authService.userId;

            this.authService
                .estaLogueado()
                .then((auth) => {
                    if (auth) {
                        this.userId = auth.uid;
                    }
                    return this.obtenerAsignaturasPorUsuario(this.userId);
                })
                .then(([auth]) => {
                    resolve();
                }, reject);
        });
    }

    obtenerAsignaturasPorUsuario(userId) {
        const userRef = this.afs.doc(`usuarios/${userId}`).ref;
        const asignaturaRef = this.afs
            .collection<Asignatura>("asignaturas", (ref) =>
                ref.where("profesor", "==", userRef)
            )
            .snapshotChanges()
            .pipe(
                map((actions) =>
                    actions.map((a) => {
                        const data = a.payload.doc.data() as Asignatura;
                        const id = a.payload.doc.id;
                        return { id, ...data };
                    })
                )
            );
        return new Promise((resolve, reject) => {
            asignaturaRef.subscribe((response: any) => {
                this.asignaturas = response;
                console.log(
                    "🚀 ~ file: asignaturas.service.ts ~ line 50 ~ AsignaturasService ~ asignaturaRef.subscribe ~ response",
                    response
                );
                this.onAsignaturasChanged.next(this.asignaturas);
                resolve(this.asignaturas);
            }, reject);
        });
    }
}
