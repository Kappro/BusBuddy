import { HttpClient } from '@angular/common/http';
import {catchError, firstValueFrom, map, Observable, of} from 'rxjs';
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import {Access, Account} from "../_models/account";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private api: ApiService, private jwthelper: JwtHelperService) {
    if(localStorage.getItem("access_token")) {
      if(!this.jwthelper.isTokenExpired(localStorage.getItem("access_token"))) {
        this.isLoggedIn = true;
      }
    }
  }

  login(userDetails: { email: string; password: string }): Observable<string> {
    return this.http.post<any>(`${this.api.API_URL}/login`, userDetails)
      .pipe(
        map(response => {
          localStorage.setItem('access_token', JSON.stringify(response.access_token));
          this.isLoggedIn = true;
          return response.message;
        }),
        catchError(error => {
          console.log(error);
          this.isLoggedIn = false;
          return of("Error Logging In.");
        })
      );
  }

  register(userDetails: {name: string,
    password: string,
    email: string,
    contact: number,
    type: Access}): Observable<boolean> {
      return this.http.post<any>(`${this.api.API_URL}/signup`, userDetails)
        .pipe(
          map(response => {
            return response.message;
          }),
          catchError(error => {
            console.log(error);
            return of(false);
          })
        );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  async retrieveIdentity() {
    let account = new Account(-1, "bad", "bad", "bad", Access.BADACCOUNT, new Date(0));
    if(!this.isLoggedIn) {
      return account;
    }
    const stream = await firstValueFrom(this.http.get<any>(this.api.API_URL+"/get_identity"));
    if(stream) {
      let access = Access.BADACCOUNT;
      if(stream.type=="MANAGER") {access = Access.MANAGER}
      else if(stream.type=="DRIVER") {access = Access.DRIVER}
      account = new Account(+stream.uid,
        stream.name,
        stream.password_hashed,
        stream.email,
        access,
        stream.datetime_registered,
        stream.driver_status
      );
    }
    return account;
  }
}
