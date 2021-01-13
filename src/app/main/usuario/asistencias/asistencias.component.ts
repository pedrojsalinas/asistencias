import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { Asignatura } from "app/clases/asignatura/asignatura";
import { AsignaturaService } from "app/servicios/asignatura/asignatura.service";
import { AsistenciasService } from "app/servicios/asistencias/asistencias.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AgregarAsistenciaComponent } from "./agregar-asistencia/agregar-asistencia.component";

@Component({
    selector: "app-asistencias",
    templateUrl: "./asistencias.component.html",
    styleUrls: ["./asistencias.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class AsistenciasComponent implements OnInit {
    dialogRef: any;
    asignaturaId: string;
    private _unsubscribeAll: Subject<any>;
    asignatura: Asignatura;
    constructor(
        private _matDialog: MatDialog,
        private asistenciasService: AsistenciasService,
        private asignaturaService: AsignaturaService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.asignaturaId = this.asistenciasService.asignaturaId;
        this.asignaturaService.onAsignaturaChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((asignatura) => {
                this.asignatura = asignatura;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    agregarAsistencia() {
        this.dialogRef = this._matDialog.open(AgregarAsistenciaComponent, {
            panelClass: "contact-form-dialog",
            data: {
                action: "new",
            },
        });
        this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
            if (!response) {
                return;
            }
            const form = response.getRawValue();
            this.asistenciasService.agregarAsistencia(this.asignaturaId, form);
        });
    }
}
