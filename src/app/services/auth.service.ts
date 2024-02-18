import { EventEmitter, Injectable, Output } from '@angular/core';
import { LoginService } from './login.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { ITokenPayload } from '../Interface/itoken-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: any;
  jwtHelper = new JwtHelperService();
  
  @Output() OnLoginSuccessful: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnLogoutSuccessful: EventEmitter<any> = new EventEmitter<any>();

  constructor(private api: LoginService) {    
    try {
      let token = sessionStorage.getItem('token');

      if (token) {
        this.token = token;
        this.OnLoginSuccessful.emit();
      }
    } catch (error) {
      
    }

  }

  login(login: any) {
    this.api.login(login).subscribe(data => {
      console.log(data)
      this.token = data;
      sessionStorage.setItem('token', this.token.token)
      sessionStorage.setItem('role', this.token.rolle)
      this.OnLoginSuccessful.emit();
    })
  }

  logout(): void {
    this.token = '';
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    this.api.ProfileBehavior.next(false);
    this.OnLogoutSuccessful.emit();
  }

  private get package(): ITokenPayload | null {
    return this.jwtHelper.decodeToken<ITokenPayload>(this.token);
  }

  get authenticated(): boolean {
    if (!this.package) return false;

    let current: Date = new Date();

    let exp: Date | undefined = this.package?.exp ? new Date(this.package?.exp * 1000) : undefined;
    let nbf: Date | undefined = this.package?.nbf ? new Date(this.package?.nbf * 1000) : undefined;

    if (exp && current > exp) return false;
    if (nbf && current < nbf) return false;

    return true;
  }

  get id(): number | null {
    return this.package && this.package.id ? this.package.id : null;
  }
}