import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HeaderModule } from './shared/components/header/header.module';
import { HttpInterceptorInterceptor } from './services/interceptor/http-interceptor.interceptor';
import { AlertModule } from './shared/components/alert/alert.module';
import { LoadingModule } from './shared/components/loading/loading.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    HeaderModule,
    AlertModule,
    LoadingModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
