import { DataSource } from "@angular/cdk/table";
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { FuseUtils } from "@fuse/utils";
import { AsistenciasService } from "app/servicios/asistencias/asistencias.service";
import { BehaviorSubject, Observable, merge, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { FormGroup } from "@angular/forms";
import { AgregarAsistenciaComponent } from "../agregar-asistencia/agregar-asistencia.component";
@Component({
    selector: "asistencias-list",
    templateUrl: "./asistencias-list.component.html",
    styleUrls: ["./asistencias-list.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class AsistenciasListComponent implements OnInit {
    dataSource: FilesDataSource | null;
    displayedColumns = ["fechaRegistro", "estudiante", "fecha", "nota"];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild("filter", { static: true })
    filter: ElementRef;

    private _unsubscribeAll: Subject<any>;
    dialogRef: MatDialogRef<AgregarAsistenciaComponent, any>;
    asignaturaId: string;

    constructor(
        private asistenciasService: AsistenciasService,
        private _matDialog: MatDialog
    ) {
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void {
        this.dataSource = new FilesDataSource(
            this.asistenciasService,
            this.paginator,
            this.sort
        );
        this.asignaturaId = this.asistenciasService.asignaturaId;
    }

    editarAsistencia(asistencia) {
        this.dialogRef = this._matDialog.open(AgregarAsistenciaComponent, {
            panelClass: "contact-form-dialog",
            data: {
                action: "edit",
                asistencia,
            },
        });
        this.dialogRef.afterClosed().subscribe((response: any) => {
            if (!response) {
                return;
            }
            const actionType: string = response[0];
            const formData: FormGroup = response[1];
            switch (actionType) {
                case "save":
                    this.asistenciasService.actualizarAsistencia(
                        this.asignaturaId,
                        formData.getRawValue()
                    );
                    break;
                case "delete":
                    this.asistenciasService.borrarAsistencia(
                        this.asignaturaId,
                        asistencia.id
                    );
                    break;
            }
        });
    }
}

export class FilesDataSource extends DataSource<any> {
    private _filterChange = new BehaviorSubject("");
    private _filteredDataChange = new BehaviorSubject("");

    constructor(
        private asistenciasService: AsistenciasService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this.asistenciasService.asistencias;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this.asistenciasService.onAsistenciasChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange,
        ];

        return merge(...displayDataChanges).pipe(
            map(() => {
                let data = this.asistenciasService.asistencias.slice();

                data = this.filterData(data);

                this.filteredData = [...data];

                data = this.sortData(data);

                // Grab the page's slice of data.
                const startIndex =
                    this._matPaginator.pageIndex * this._matPaginator.pageSize;
                return data.splice(startIndex, this._matPaginator.pageSize);
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filterData(data): any {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    sortData(data): any[] {
        if (!this._matSort.active || this._matSort.direction === "") {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = "";
            let propertyB: number | string = "";

            switch (this._matSort.active) {
                case "id":
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case "name":
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case "subasistencias":
                    [propertyA, propertyB] = [
                        a.subasistencias[0],
                        b.subasistencias[0],
                    ];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (
                (valueA < valueB ? -1 : 1) *
                (this._matSort.direction === "asc" ? 1 : -1)
            );
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void {}
}
