import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  email!: string;
  loggedIn$!: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      this.email = parsedUser.email

    } else {
      console.warn('User data is null in localStorage.');
    }

    this.loggedIn$ = this.authService.isLoggedIn(); 
  }

  Logout() {
    this.authService.signOut();

  }

}
