import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "app/servicios/auth/auth.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
    loginForm: FormGroup;
    dialogTitle = "Ingreso";

    constructor(
        public matDialogRef: MatDialogRef<LoginComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _formBuilder: FormBuilder,
        private authService: AuthService
    ) {
        this.loginForm = this.generateLoginForm();
    }

    generateLoginForm(): FormGroup {
        return this._formBuilder.group({
            email: ["", Validators.required],
            password: ["", Validators.required],
        });
    }

    login() {
        const login = this.loginForm.getRawValue();
        this.authService.signInWithEmailAndPassword(login);
        this.matDialogRef.close(this.loginForm);
    }
}
