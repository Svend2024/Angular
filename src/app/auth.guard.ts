import { CanActivateFn, Router } from '@angular/router';

export const ProductManager: CanActivateFn = (route, state) => {
  const isProductManager= sessionStorage.getItem('role') === 'ProductManager';

  if (!isProductManager) {
    let router = new Router 
    router.navigate(['/store']);
    return false;
  }
  return true;
};

export const Customer: CanActivateFn = (route, state) => {
  const isCustomer= sessionStorage.getItem('role') === 'Customer';
  const isProductManager= sessionStorage.getItem('role') === 'ProductManager';
  
  if (!isCustomer && !isProductManager) {
    let router = new Router 
    router.navigate(['/store']);
    return false;
  }
  return true;
};