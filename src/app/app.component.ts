import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'KameGame';
  role: any = '';
  _login: LoginService;
  isLoggedSubscription: Subscription = new Subscription();
  isLoggedReady: boolean = true;
  isDropdownOpen: boolean = false;

  constructor(private login: LoginService, private auth: AuthService) {
    this._login = login;
  }

  ngOnInit(): void {
    this.isLoggedSubscription = this._login.IsLogged.subscribe((isLogged: boolean) => {      
      if(!isLogged && sessionStorage.getItem('token')) {
        this._login.ProfileBehavior.next(true);
        // this._login.setLoggedReadyStatus(true);
      }
    });
    this.role = sessionStorage.getItem('role')
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  ngOnDestroy(): void {
    this.isLoggedSubscription.unsubscribe(); // Sørg for at afmelde abonnementet når komponenten ødelægges
  }

  logOut() {
    this.auth.logout();
  }
}
