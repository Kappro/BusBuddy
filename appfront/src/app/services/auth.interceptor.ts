import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import { Observable } from "rxjs";

export const JwtInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const token = localStorage.getItem('access_token');
    const cloned_request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`.replace(/['"]+/g, '')
      }
    });
    return next(cloned_request);
}
