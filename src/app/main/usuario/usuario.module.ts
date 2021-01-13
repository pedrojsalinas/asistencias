import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AsignaturasComponent } from "./asignaturas/asignaturas.component";
import { UsuarioRoutingModule } from "./usuario-routing.module";
import { SharedModule } from "app/shared.module";
import { MaterialModule } from "../material.module";
import { EstudiantesComponent } from "./asignaturas/estudiantes/estudiantes.component";
import { AsistenciasComponent } from "./asistencias/asistencias.component";
import { AgregarAsistenciaComponent } from "./asistencias/agregar-asistencia/agregar-asistencia.component";
import { AsistenciasListComponent } from './asistencias/asistencias-list/asistencias-list.component';

@NgModule({
    declarations: [
        AsignaturasComponent,
        EstudiantesComponent,
        AsistenciasComponent,
        AgregarAsistenciaComponent,
        AsistenciasListComponent,
    ],
    imports: [CommonModule, UsuarioRoutingModule, SharedModule, MaterialModule],
    entryComponents: [],
})
export class UsuarioModule {}
