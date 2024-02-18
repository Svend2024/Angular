import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public ProfileBehavior: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public ProductManagerBehavior: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public IsProductManager: Observable<boolean> = this.ProductManagerBehavior.asObservable();
  public IsLogged: Observable<boolean> = this.ProfileBehavior.asObservable();

  constructor(private http: HttpClient) { }

  login(login: any) {
    return this.http.post('https://localhost:44361/api/Logins/Login', login)    
  }
}
