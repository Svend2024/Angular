import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Login } from '../login/login.component';
import { Customer } from '../Interface/customer';
import { AuthService } from '../services/auth.service';

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

  role: string |null = "" ;

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
    if(this.role === "Customer") {
      return this.customerVerifyForm.controls;
    }
    else {
      return this.productManagerVerifyForm.controls;
    }    
  }

  verifyEmailInput = '';
  verifyPasswordInput = '';

  login: Login = {
    username: '',
    password: ''
  }

  customer: Customer = {
    id: 0,
    fullname: '',
    zipCode: '',
    address: '',
    email: ''
  }

  productManager: any = {
    fullname: ''
  }
  
  // onCreateCustomer() {
  //   this.submitted = true;
  //   if (this.verifyForm.invalid) {
  //     alert("Udfyld manglende felter i formularen");    
  //     return;
  //   }
  //   if (this.verifyForm.get('verifyEmail')!.value != this.verifyForm.get('email')!.value) {
  //     alert("E-mail missmatch");
  //   } 
  //   else if (this.verifyForm.get('verifyPassword')!.value != this.verifyForm.get('password')!.value) {
  //     alert("Password missmatch");
  //   }
  //   else {
  //     this.customer.fullname = this.verifyForm.get('fullname')!.value;
  //     this.customer.zipCode = this.verifyForm.get('zipCode')!.value;
  //     this.customer.address = this.verifyForm.get('address')!.value;
  //     this.customer.email = this.verifyForm.get('email')!.value;
  //     this.login.username = this.verifyForm.get('username')!.value;
  //     this.login.password = this.verifyForm.get('password')!.value;

  //     this.http.post('https://localhost:44361/api/Customers', this.customer).subscribe((res: any) => {
  //       if (res.id != null) {
  //         this.router.navigate(['./login']);
  //         alert("Customer successfully created!")
  //       }
  //       else {
  //         alert(res)
  //       }
  //     })
  //   }
  // }

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

      // Skal bruge token id her
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

      // Skal bruge token id her
      this.http.put(`https://localhost:44361/api/ProductManagers/${this.auth.id}`, this.productManager).subscribe((res: any) => {
        alert("Produkt Manager Opdateret!")
      })
    }
  }

  onUpdateLogin() {
    this.loginSubmitted = true;
    if (this.loginVerifyForm.invalid) {
      alert("Udfyld manglende felt i formularen");    
      return;
    }
    else {
      this.productManager.id = this.auth.id;
      this.productManager.fullname = this.productManagerVerifyForm.get('fullname')!.value;

      // Skal bruge token id her
      this.http.put(`https://localhost:44361/api/Logins/${this.auth.id}`, this.productManager).subscribe((res: any) => {
        alert("Produkt Manager Opdateret!")
      })
    }
  }
}
