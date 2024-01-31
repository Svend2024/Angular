import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { customInterceptor } from './services/custom.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideClientHydration(), 
    importProvidersFrom(HttpClientModule), 
    provideHttpClient(withInterceptors([customInterceptor]))]
};
