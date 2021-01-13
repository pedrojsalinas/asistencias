import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { Asignatura } from "app/clases/asignatura/asignatura";
import { AsignaturasService } from "app/servicios/asignaturas/asignaturas.service";
import { EstudiantesService } from "app/servicios/estudiantes/estudiantes.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { EstudiantesComponent } from "./estudiantes/estudiantes.component";

@Component({
    selector: "app-asignaturas",
    templateUrl: "./asignaturas.component.html",
    styleUrls: ["./asignaturas.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class AsignaturasComponent implements OnInit {
    private _unsubscribeAll: Subject<any>;
    asignaturas: Asignatura[];
    dialogRef: any;
    constructor(
        private asignaturasService: AsignaturasService,
        private estudiantesService: EstudiantesService,
        private _matDialog: MatDialog
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.asignaturasService.onAsignaturasChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((asignaturas) => {
                this.asignaturas = asignaturas;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    verEstudiantes(asignatura: Asignatura) {
        this.estudiantesService.obtenerEstudiantesPorAsignatura(asignatura.id);
        this.dialogRef = this._matDialog.open(EstudiantesComponent, {
            panelClass: "contact-form-dialog",
            data: {
                asignatura,
            },
        });
        this.dialogRef.afterClosed().subscribe((response: any) => {
            if (!response) {
                return;
            }
        });
    }
}
