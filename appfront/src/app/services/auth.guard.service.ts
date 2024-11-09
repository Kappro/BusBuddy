import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from "@angular/core";
import {Observable, of} from "rxjs";
import {Access} from "../_models/account";

/**
 * @ignore
 */
export const AuthGuardService: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
    return inject(AuthService).isAuthenticated()
      ? true
      : inject(Router).createUrlTree(['/login']);
};

/**
 * Guard service function that prevents the wrong access type from accessing the stipulated role for the path.
 */
export const RoleGuardService: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const expectedRoles = route.data['expectedRoles'];
  const auth = inject(AuthService);

  if(auth.isAuthenticated()) {
    return auth.retrieveIdentity().then(
      account => {
        return (expectedRoles.includes(account.access));
      }
    ).catch(
      error => {
        console.error('Account promise rejected with ' + error)
        return false;
      }
    );
  }
  else return inject(Router).navigate(['login']);
}

/**
 * Guard service function that redirects the user according to the access type.
 */
export const LoginGuardService: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if(auth.isAuthenticated()) {
    return auth.retrieveIdentity().then(
      account => {
        if(account.access==Access.MANAGER) {return router.navigate(['manager'])}
        else if(account.access===Access.DRIVER) {return router.navigate(['driver'])}
        else return true;
      }
    ).catch(
      error => {
        console.error('Account promise rejected with ' + error)
        return false;
      }
    );
  }
  else return true;
}
