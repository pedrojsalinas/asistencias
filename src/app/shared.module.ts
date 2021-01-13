import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./main/shared/modales/login/login.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MaterialModule } from "./main/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DocPipe } from "./pipes/doc.pipe";

@NgModule({
    declarations: [LoginComponent, DocPipe],
    imports: [
        CommonModule,
        MatDialogModule,
        MaterialModule,
        FormsModule,
        FlexLayoutModule,
        ReactiveFormsModule,
    ],
    exports: [
        LoginComponent,
        MatDialogModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        DocPipe,
    ],
    entryComponents: [LoginComponent],
})
export class SharedModule {}
