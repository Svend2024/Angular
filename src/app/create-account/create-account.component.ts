import { Component, OnInit } from '@angular/core';
import { Customer } from '../Interface/customer';
import { Login } from '../Interface/login';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Console, debug } from 'console';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent implements OnInit {

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  verifyForm: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    zipCode: new FormControl(''),
    address: new FormControl(''),
    email: new FormControl(''),
    verifyEmail: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    verifyPassword: new FormControl('')
  });
  submitted = false;

  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        zipCode: ['', Validators.required, this.asyncZipCodeValidator],
        address: ['', Validators.required],
        email: ['', Validators.email, this.asyncEmailValidator],
        verifyEmail: ['', Validators.email, this.asyncEmailValidator],
        username: ['', Validators.required, this.asyncLoginValidator],
        password: ['', Validators.required, this.asyncLoginValidator],
        verifyPassword: ['', Validators.required, this.asyncLoginValidator]
      }
    );
  }

  asyncLoginValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if(control.value.toString().length < 6) {
      return of({ 'minlength': true});
    }
    if(control.value.toString().length > 32) {
      return of({ 'maxlength': true});
    }
    return of(null);
  }

  asyncZipCodeValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if(control.value.toString().length !== 4) {
      return of({ 'requiredValue': true});
    }
    return of(null);
  }

  asyncEmailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if(control.value.toString().length < 1) {
      return of({ 'required': true});
    }
    return of(null);
  }

  // TypeScript egenskab(property). Gør så jeg kan tilgå f metoden, som var det en variabel. 
  // Giver mulighed for at arbejde med formControl og validering
  get f(): { [key: string]: AbstractControl } {
    return this.verifyForm.controls;
  }

  verifyEmailInput = '';
  verifyPasswordInput = '';

  login: Login = {
    username: '',
    password: ''
  }

  customer: Customer = {
    fullname: '',
    zipCode: '',
    address: '',
    email: '',
    login: this.login
  }

  onCreateCustomer() {
    this.submitted = true;
    if (this.verifyForm.invalid) {
      alert("Udfyld manglende felter i formularen");    
      return;
    }
    if (this.verifyForm.get('verifyEmail')!.value != this.verifyForm.get('email')!.value) {
      alert("E-mail missmatch");
    } 
    else if (this.verifyForm.get('verifyPassword')!.value != this.verifyForm.get('password')!.value) {
      alert("Password missmatch");
    }
    else {
      this.customer.fullname = this.verifyForm.get('fullname')!.value;
      this.customer.zipCode = this.verifyForm.get('zipCode')!.value;
      this.customer.address = this.verifyForm.get('address')!.value;
      this.customer.email = this.verifyForm.get('email')!.value;
      this.login.username = this.verifyForm.get('username')!.value;
      this.login.password = this.verifyForm.get('password')!.value;

      this.http.post('https://localhost:44361/api/Customers', this.customer).subscribe((res: any) => {
        if (res.id != null) {
          alert("Customer successfully created!")
        }
        else {
          alert(res)
        }
      })
    }
  }
}
