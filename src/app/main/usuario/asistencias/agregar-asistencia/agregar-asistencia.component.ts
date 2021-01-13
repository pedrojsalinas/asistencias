import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Asistencia } from "app/clases/asistencia/asistencia";
import { Estudiante } from "app/clases/estudiante/estudiante";
import { EstudiantesService } from "app/servicios/estudiantes/estudiantes.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-agregar-asistencia",
    templateUrl: "./agregar-asistencia.component.html",
    styleUrls: ["./agregar-asistencia.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class AgregarAsistenciaComponent implements OnInit {
    asistenciaForm: FormGroup;
    action: string;
    asistencia: Asistencia;
    dialogTitle: string;
    private _unsubscribeAll: Subject<any>;
    estudiantes: Estudiante[];

    constructor(
        public matDialogRef: MatDialogRef<AgregarAsistenciaComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _formBuilder: FormBuilder,
        private estudiantesService: EstudiantesService
    ) {
        this._unsubscribeAll = new Subject();
        this.action = data.action;

        if (this.action === "edit") {
            this.dialogTitle = "Editar Asistencia";
            this.asistencia = new Asistencia(data.asistencia);
        } else {
            this.dialogTitle = "Agregar Asistencia";
            this.asistencia = new Asistencia({});
        }
        this.asistenciaForm = this.generateLoginForm();
    }
    ngOnInit(): void {
        this.estudiantesService.onEstudiantesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((estudiantes) => {
                this.estudiantes = estudiantes;
            });
    }
    generateLoginForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.asistencia.id],
            estudiante: [
                this.asistencia.estudiante ? this.asistencia.estudiante.id : "",
                Validators.required,
            ],
            fecha: [
                this.asistencia.fecha ? this.asistencia.fecha.toDate() : "",
                Validators.required,
            ],
            nota: [this.asistencia.nota],
        });
    }
}
