import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from "@angular/router";
import { Asistencia } from "app/clases/asistencia/asistencia";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AsignaturaService } from "../asignatura/asignatura.service";
import { AsignaturasService } from "../asignaturas/asignaturas.service";
import { EstudiantesService } from "../estudiantes/estudiantes.service";

@Injectable({
    providedIn: "root",
})
export class AsistenciasService implements Resolve<any> {
    asistencias: Asistencia[];
    onAsistenciasChanged: BehaviorSubject<any>;
    asignaturaId: string;

    constructor(
        private afs: AngularFirestore,
        private estudiantesService: EstudiantesService,
        private asignaturaService: AsignaturaService
    ) {
        this.onAsistenciasChanged = new BehaviorSubject([]);
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        this.asignaturaId = route.params.id;
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.obtenerAsistenciasPorAsignatura(this.asignaturaId),
                this.asignaturaService.obtenerAsignatura(this.asignaturaId),
                this.estudiantesService.obtenerEstudiantesPorAsignatura(
                    this.asignaturaId
                ),
            ]).then(() => {
                resolve();
            }, reject);
        });
    }

    async agregarAsistencia(asignaturaId, asistencia: Asistencia) {
        delete asistencia.id;
        asistencia.fecha = asistencia.fecha.toDate();
        asistencia.fechaRegistro = new Date();
        asistencia.estudiante = this.afs.doc(
            `estudiantes/${asistencia.estudiante}`
        ).ref;
        await this.afs
            .collection(`asignaturas/${asignaturaId}/asistencias`)
            .add(asistencia)
            .then((result) => {
                console.log(
                    "🚀 ~ file: asistencias.service.ts ~ line 51 ~ AsistenciasService ~ .then ~ result",
                    result
                );
            })
            .catch((err) => {
                console.log(
                    "🚀 ~ file: asistencias.service.ts ~ line 54 ~ AsistenciasService ~ agregarAsistencia ~ err",
                    err
                );
            });
    }

    async actualizarAsistencia(asignaturaId, asistencia: Asistencia) {
        const asistenciaId = asistencia.id;
        delete asistencia.id;
        asistencia.fecha =
            asistencia.fecha instanceof Date
                ? asistencia.fecha
                : asistencia.fecha.toDate();
        asistencia.estudiante = this.afs.doc(
            `estudiantes/${asistencia.estudiante}`
        ).ref;
        await this.afs
            .doc(`asignaturas/${asignaturaId}/asistencias/${asistenciaId}`)
            .update(asistencia)
            .then((result) => {
                console.log(
                    "🚀 ~ file: asistencias.service.ts ~ line 51 ~ AsistenciasService ~ .then ~ result",
                    result
                );
            })
            .catch((err) => {
                console.log(
                    "🚀 ~ file: asistencias.service.ts ~ line 54 ~ AsistenciasService ~ agregarAsistencia ~ err",
                    err
                );
            });
    }

    async borrarAsistencia(asignaturaId, asistenciaId) {
        await this.afs
            .doc(`asignaturas/${asignaturaId}/asistencias/${asistenciaId}`)
            .delete()
            .then((result) => {
                console.log(
                    "🚀 ~ file: asistencias.service.ts ~ line 51 ~ AsistenciasService ~ .then ~ result",
                    result
                );
            })
            .catch((err) => {
                console.log(
                    "🚀 ~ file: asistencias.service.ts ~ line 54 ~ AsistenciasService ~ agregarAsistencia ~ err",
                    err
                );
            });
    }

    obtenerAsistenciasPorAsignatura(asignaturaId) {
        console.log(
            "🚀 ~ file: asistencias.service.ts ~ line 39 ~ AsistenciasService ~ obtenerAsistenciasPorAsignatura ~ asignaturaId",
            asignaturaId
        );
        const asistenciaRef = this.afs
            .collection<Asistencia>(`asignaturas/${asignaturaId}/asistencias`)
            .snapshotChanges()
            .pipe(
                map((actions) =>
                    actions.map((a) => {
                        const data = a.payload.doc.data() as Asistencia;
                        const id = a.payload.doc.id;
                        return { id, ...data };
                    })
                )
            );
        return new Promise((resolve, reject) => {
            asistenciaRef.subscribe((response: any) => {
                this.asistencias = response;
                this.onAsistenciasChanged.next(this.asistencias);
                resolve(this.asistencias);
            }, reject);
        });
    }
}
