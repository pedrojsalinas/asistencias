import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Estudiante } from "app/clases/estudiante/estudiante";
import { EstudiantesService } from "app/servicios/estudiantes/estudiantes.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-estudiantes",
    templateUrl: "./estudiantes.component.html",
    styleUrls: ["./estudiantes.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class EstudiantesComponent {
    dialogTitle = "Estudiantes";
    private _unsubscribeAll: Subject<any>;
    estudiantes: Estudiante[];

    constructor(
        public matDialogRef: MatDialogRef<EstudiantesComponent>,
        private estudiantesService: EstudiantesService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.estudiantesService.onEstudiantesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((estudiantes) => {
                this.estudiantes = estudiantes;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
