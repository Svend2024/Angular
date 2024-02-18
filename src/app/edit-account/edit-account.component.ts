import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Customer } from '../Interface/customer';
import { AuthService } from '../services/auth.service';
import { Login } from '../Interface/login';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.css'
})
export class EditAccountComponent implements OnInit {
  jwt: any;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private auth: AuthService) { }

  role: string | null = "";

  customerData: Customer = {}
  productManagerData: any = {}

  customerVerifyForm: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    zipCode: new FormControl(''),
    address: new FormControl(''),
    email: new FormControl(''),
    verifyEmail: new FormControl('')
  });

  productManagerVerifyForm: FormGroup = new FormGroup({
    fullname: new FormControl('')
  });

  loginVerifyForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    verifyPassword: new FormControl('')
  });
  submitted = false;
  loginSubmitted = false;

  ngOnInit(): void {
    this.role = sessionStorage.getItem('role')
    if (this.role === "Customer") {
      this.http.get(`https://localhost:44361/api/Customers/${this.auth.id}`).subscribe((res: any) => {
        this.customerData = res
        this.customerVerifyForm.patchValue({
          fullname: this.customerData.fullname,
          zipCode: this.customerData.zipCode,
          address: this.customerData.address,
          email: this.customerData.email
        });
      });
      this.customerVerifyForm = this.formBuilder.group(
        {
          fullname: ['', Validators.required],
          zipCode: ['', Validators.required, this.asyncZipCodeValidator],
          address: ['', Validators.required],
          email: ['', Validators.email, this.asyncEmailValidator],
          verifyEmail: ['', Validators.email, this.asyncEmailValidator]
        }
      );
    }
    if (this.role === "ProductManager") {
      this.http.get(`https://localhost:44361/api/ProductManagers/${this.auth.id}`).subscribe((res: any) => {
        this.productManagerData = res
        console.log(this.productManagerData)
        this.productManagerVerifyForm.patchValue({
          fullname: this.productManagerData.fullname
        });
      })

      this.productManagerVerifyForm = this.formBuilder.group(
        {
          fullname: ['', Validators.required]
        }
      );
    }
    this.loginVerifyForm = this.formBuilder.group(
      {
        username: ['', Validators.required, this.asyncLoginValidator],
        password: ['', Validators.required, this.asyncLoginValidator],
        verifyPassword: ['', Validators.required, this.asyncLoginValidator]
      }
    );
  }

  asyncLoginValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.value.toString().length < 6) {
      return of({ 'minlength': true });
    }
    if (control.value.toString().length > 32) {
      return of({ 'maxlength': true });
    }
    return of(null);
  }

  asyncZipCodeValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.value.toString().length !== 4) {
      return of({ 'requiredValue': true });
    }
    return of(null);
  }

  asyncEmailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.value.toString().length < 1) {
      return of({ 'required': true });
    }
    return of(null);
  }

  get f(): { [key: string]: AbstractControl } {
    if (this.role === "Customer") {
      return this.customerVerifyForm.controls;
    }
    else {
      return this.productManagerVerifyForm.controls;
    }
  }

  get l(): { [key: string]: AbstractControl } {
    return this.loginVerifyForm.controls;
  }

  verifyEmailInput = '';
  verifyPasswordInput = '';

  login: Login = {
    id: 0,
    username: '',
    password: ''
  }

  // Customer der kan bruge til flere kald
  customer: Customer = {}

  productManager: any = {
    fullname: ''
  }

  onUpdateCustomer() {
    this.submitted = true;
    if (this.customerVerifyForm.invalid) {
      alert("Udfyld manglende felter i formularen");
      return;
    }
    if (this.customerVerifyForm.get('verifyEmail')!.value != this.customerVerifyForm.get('email')!.value) {
      alert("E-mail missmatch");
    }
    else {
      this.customer.id = this.auth.id;
      this.customer.fullname = this.customerVerifyForm.get('fullname')!.value;
      this.customer.zipCode = this.customerVerifyForm.get('zipCode')!.value;
      this.customer.address = this.customerVerifyForm.get('address')!.value;
      this.customer.email = this.customerVerifyForm.get('email')!.value;
      this.customer.loginId = this.customerData.loginId;
      this.http.put(`https://localhost:44361/api/Customers/${this.auth.id}`, this.customer).subscribe((res: any) => {
        alert("Kunde Opdateret!")
      })
    }
  }

  onUpdateProductManager() {
    this.submitted = true;
    if (this.productManagerVerifyForm.invalid) {
      alert("Udfyld manglende felt i formularen");
      return;
    }
    else {
      this.productManager.id = this.auth.id;
      this.productManager.fullname = this.productManagerVerifyForm.get('fullname')!.value;
      this.productManager.loginId = this.productManagerData.loginId;

      this.http.put(`https://localhost:44361/api/ProductManagers/${this.auth.id}`, this.productManager).subscribe((res: any) => {
        alert("Produkt Manager Opdateret!")
      })
    }
  }

  onUpdateLogin() {
    this.loginSubmitted = true;
    if (this.loginVerifyForm.invalid) {
      alert("Udfyld manglende felter i formularen");
      return;
    }
    else {
      this.login.username = this.loginVerifyForm.get('username')!.value;
      this.login.password = this.loginVerifyForm.get('password')!.value;
      let id;
      if (Object.keys(this.customerData).length !== 0) {
        id = this.customerData.loginId;
      }
      else {
        id = this.productManagerData.loginId;
      }
      this.login.id = id;

      this.http.put(`https://localhost:44361/api/Logins/${id}`, this.login).subscribe((res: any) => {
        alert("Login Opdateret!")
      })
    }
  }
}
