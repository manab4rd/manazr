import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request)
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${error.error.message}`;
              alert('Data Not Saved. ClientSide Error');
            } else if (error.status === 500){
              // server-side error
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
              alert('Error Code: ' + error.status + ', Session Expired. Reloading...');
              location.reload();
            } else if (error.status === 0){
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
              alert('Error Code: ' + error.status + ', Server Disconnected. Contact Administrator');
              console.log(errorMessage);
            } else{
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
              console.log(errorMessage);
            }
            // window.alert(errorMessage);
            return throwError(errorMessage);
          })
        );
    }
  }
