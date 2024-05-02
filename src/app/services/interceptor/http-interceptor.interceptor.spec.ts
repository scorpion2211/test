import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { HttpInterceptorInterceptor } from './http-interceptor.interceptor';
import { Observable, throwError } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('HttpInterceptorInterceptor', () => {
  let interceptor: HttpInterceptorInterceptor;
  let nextHandler: HttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpInterceptorInterceptor],
    });
    interceptor = TestBed.inject(HttpInterceptorInterceptor);
    nextHandler = {
      handle: (): Observable<HttpEvent<any>> => {
        return new Observable();
      },
    } as HttpHandler;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept and add authorId header to the request', () => {
    const request = new HttpRequest('GET', '/api/data');
    spyOn(nextHandler, 'handle').and.callThrough();

    interceptor.intercept(request, nextHandler);

    expect(nextHandler.handle).toHaveBeenCalledOnceWith(jasmine.any(HttpRequest));
    const modifiedRequest = (nextHandler.handle as jasmine.Spy).calls.mostRecent()
      .args[0] as HttpRequest<any>;
    expect(modifiedRequest.headers.get('authorId')).toEqual('96');
  });

  it('should handle HttpErrorResponse and log error message', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });
    spyOn(console, 'log');
    spyOn(nextHandler, 'handle').and.returnValue(throwError(errorResponse));

    interceptor.intercept(new HttpRequest('GET', '/api/data'), nextHandler).subscribe({
      error: () => {
        expect(console.log).toHaveBeenCalledWith('Error al cargar Servicio', errorResponse);
      },
    });
  });

  it('should throw an error when handling HttpErrorResponse', () => {
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });
    spyOn(console, 'log');
    spyOn(nextHandler, 'handle').and.returnValue(throwError(errorResponse));

    interceptor.intercept(new HttpRequest('GET', '/api/data'), nextHandler).subscribe({
      error: (error) => {
        expect(error).toEqual('Error');
      },
    });
  });
});
