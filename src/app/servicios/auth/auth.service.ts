import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import firebase from "firebase/app";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { first } from "rxjs/internal/operators/first";
@Injectable({
    providedIn: "root",
})
export class AuthService {
    user: BehaviorSubject<any>;
    logged: BehaviorSubject<boolean>;
    userId: string;
    constructor(
        public auth: AngularFireAuth,
        private router: Router,
        private afs: AngularFirestore
    ) {
        this.user = new BehaviorSubject({});
        this.logged = new BehaviorSubject(false);
        this.isLoggedIn();
    }

    loginWithGoogle() {
        this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
    logout() {
        this.auth.signOut().then(() => {
            this.user.next({});
            this.logged.next(false);
            this.router.navigate(["/"]);
        });
    }

    async signInWithEmailAndPassword(user) {
        await this.auth
            .signInWithEmailAndPassword(user.email, user.password)
            .then(async (data) => {
                this.logged.next(true);
                await this.getUser(data.user.uid);
            });
    }
    async getUser(userUid) {
        return new Promise(async (resolve, reject) => {
            await this.afs
                .doc(`usuarios/${userUid}`)
                .valueChanges()
                .subscribe((userSnap: any) => {
                    const userData = { ...userSnap, id: userUid };
                    this.user.next(userData);
                    this.router.navigate(["/asignaturas"]);
                    resolve(this.user);
                }, reject);
        });
    }

    async createUserWithEmailAndPassword(user) {
        const usuarioForm = user;
        await this.auth
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(async (userData) => {
                this.logged.next(true);
                await this.updateUserData(userData.user, usuarioForm);
                await this.getUser(userData.user.uid);
            });
    }

    async updateUserData(user, usuarioForm?) {
        const form = usuarioForm;
        const userRef = this.afs.doc(`usuarios/${user.uid}`);
        delete form.password;
        return await userRef.set(form);
    }

    async isLoggedIn() {
        const user = await this.auth.authState.pipe(first()).toPromise();
        if (user) {
            this.logged.next(true);
            this.userId = user.uid;
            await this.getUser(user.uid);
        }
    }

    estaLogueado() {
        return this.auth.authState.pipe(first()).toPromise();
    }
}
