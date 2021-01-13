import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AsignaturasService } from "app/servicios/asignaturas/asignaturas.service";
import { AsignaturasComponent } from "./asignaturas/asignaturas.component";
import { canActivate, redirectUnauthorizedTo } from "@angular/fire/auth-guard";
import { AsistenciasService } from "app/servicios/asistencias/asistencias.service";
import { AsistenciasComponent } from "./asistencias/asistencias.component";
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["/"]);
const routes: Routes = [
    {
        path: "asistencias/:id",
        component: AsistenciasComponent,
        resolve: {
            data: AsistenciasService,
        },
        ...canActivate(redirectUnauthorizedToLogin),
    },
    {
        path: "asignaturas",
        component: AsignaturasComponent,
        resolve: {
            data: AsignaturasService,
        },
        ...canActivate(redirectUnauthorizedToLogin),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UsuarioRoutingModule {}
