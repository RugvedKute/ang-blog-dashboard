import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggedAuthGuard: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private toaster: ToastrService,
    private router: Router
  ) { }

  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password).then((docRef) => {
      this.toaster.success('Login Successfully..')
      this.loadUser();
      this.loggedIn.next(true)
      this.loggedAuthGuard = true;
      this.router.navigate(['']);
    }).catch((err) => {
      this.toaster.warning(err);
    })
  }

  signOut() {
    this.afAuth.signOut().then((docRef) => {
      this.toaster.success('Logout successful')
      this.router.navigate(['login/'])
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.loggedAuthGuard = true;
    }).catch((err) => {
      this.toaster.warning(err);
    })
  }

  loadUser() {
    this.afAuth.authState.subscribe(user => {  
      localStorage.setItem('user', JSON.stringify(user));
    })
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
