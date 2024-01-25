import { ApplicationConfig } from '@angular/core';
import { Routes, provideRouter, withDebugTracing } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StoreComponent } from './store/store.component';
import { DeckComponent } from './deck/deck.component';
import { CartComponent } from './cart/cart.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'store', component: StoreComponent },
    { path: 'deck', component: DeckComponent },
    { path: 'cart', component: CartComponent },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent },
];

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes, withDebugTracing())]
}
