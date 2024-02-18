import { ApplicationConfig } from '@angular/core';
import { Routes, provideRouter, withDebugTracing } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { DeckComponent } from './deck/deck.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { CreateCardComponent } from './create-card/create-card.component';
import { Customer, ProductManager } from './auth.guard';

export const routes: Routes = [
    { path: 'store', component: StoreComponent },
    { path: 'deck', component: DeckComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'create-card', component: CreateCardComponent, canActivate:[ProductManager]},
    { path: 'create-account', component: CreateAccountComponent },
    { path: 'edit-account', component: EditAccountComponent, canActivate:[Customer]},
    { path: '**', redirectTo: 'store' }
];

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes, withDebugTracing())]
}
