import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: Login

  constructor(private http: HttpClient, private router: Router){
    this.loginObj = new Login()
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
    this.http.post('https://localhost:44361/api/Logins/Login',this.loginObj).subscribe((res:any)=>{
      if(res.token != ''){
        alert("login success")
        localStorage.setItem('token', res.token);
      }
      else{
        alert("login failed")
      }
    })
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
