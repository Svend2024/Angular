import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginObj: Login

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private login: LoginService){
    this.loginObj = new Login()
  }
  ngOnInit(): void {
    this.login.IsLogged.subscribe()
  }

  public validator = {
    'Username': [
      { type: 'required', message: "Username is empty"}
    ], 
    'Password': [
      { type: 'required', message: "Password is empty"}
    ]
  }

  onLogin() {
    this.authService.login(this.loginObj)
    this.authService.OnLoginSuccessful.subscribe(next => {
      this.login.ProfileBehavior.next(true);
      this.router.navigate(['./store'])
    })
    

    // this.http.post('https://localhost:44361/api/Logins/Login',this.loginObj).subscribe((res:any)=>{
    //   if(res.token != ''){
    //     alert("login success")
    //     localStorage.setItem('token', res.token);
    //   }
    //   else{
    //     alert("login failed")
    //   }
    // })
  }

  onCreateAccount(){
    this.router.navigate(['./create-account']);
  }

}

export class Login {
  username: string;
  password: string;
  constructor(){
    this.username = '';
    this.password = '';
  }
}
