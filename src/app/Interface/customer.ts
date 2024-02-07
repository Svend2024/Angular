import { Login } from "../login/login.component";

export interface Customer {
    fullname: string;
    zipCode: string;
    address: string;
    email: string;
    login? : Login; 
}
