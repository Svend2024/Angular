import { Login } from "../login/login.component";

export interface Customer {
    id?: number | null;
    fullname?: string;
    zipCode?: string;
    address?: string;
    email?: string;
    login? : Login; 
    loginId?: number;
}
