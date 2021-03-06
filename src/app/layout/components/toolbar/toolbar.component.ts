import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";

import { FuseConfigService } from "@fuse/services/config.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

import { navigation } from "app/navigation/navigation";
import { LoginComponent } from "app/main/shared/modales/login/login.component";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "app/servicios/auth/auth.service";
import { Usuario } from "app/clases/usuario/usuario";

@Component({
    selector: "toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];

    // Private
    private _unsubscribeAll: Subject<any>;
    dialogRef: any;
    logged: boolean;
    user: Usuario;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private authService: AuthService,
        private _translateService: TranslateService,
        private _matDialog: MatDialog
    ) {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: "Online",
                icon: "icon-checkbox-marked-circle",
                color: "#4CAF50",
            },
            {
                title: "Away",
                icon: "icon-clock",
                color: "#FFC107",
            },
            {
                title: "Do not Disturb",
                icon: "icon-minus-circle",
                color: "#F44336",
            },
            {
                title: "Invisible",
                icon: "icon-checkbox-blank-circle-outline",
                color: "#BDBDBD",
            },
            {
                title: "Offline",
                icon: "icon-checkbox-blank-circle-outline",
                color: "#616161",
            },
        ];

        this.languages = [
            {
                id: "en",
                title: "English",
                flag: "us",
            },
            {
                id: "tr",
                title: "Turkish",
                flag: "tr",
            },
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar =
                    settings.layout.navbar.position === "top";
                this.rightNavbar = settings.layout.navbar.position === "right";
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        this.authService.logged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((logged) => {
                this.logged = logged;
            });

        this.authService.user
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = user;
            });
        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {
            id: this._translateService.currentLang,
        });
    }

    login() {
        this.dialogRef = this._matDialog.open(LoginComponent, {
            panelClass: "contact-form-dialog",
            data: {
                action: "new",
            },
        });
        this.dialogRef.afterClosed().subscribe((response: any) => {
            if (!response) {
                return;
            }
        });
    }

    logout() {
        this.authService.logout();
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }
}
