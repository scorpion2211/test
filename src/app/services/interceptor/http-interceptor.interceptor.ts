import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const reqClone = request.clone({
      headers: request.headers.set('authorId', '96'),
    });
    return next.handle(reqClone).pipe(catchError(this.MensajeDeError));
  }

  MensajeDeError(error: HttpErrorResponse) {
    console.log('Error al cargar Servicio', error);
    return throwError('Error');
  }
}
