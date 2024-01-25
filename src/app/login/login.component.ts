import { Component } from '@angular/core';
import { Login } from '../interfaces/login';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login : Login =  {
    username: '',
    password: ''
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
    console.log(this.login.username + " " + this.login.password)
  }

  onCreateAccount(){
    return
  }

}

