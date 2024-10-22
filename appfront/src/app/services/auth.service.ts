import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BusBuddyService} from "../service";

export class AuthService {
  constructor(private http: HttpClient, private api: BusBuddyService) {}

  isLoggedIn: boolean = false;

  login(userDetails: { username: string; password: string }): Observable<boolean> {
    return this.http.post<any>(`http://${this.api.API_URL}/login`, userDetails)
      .pipe(
        map(response => {
          localStorage.setItem('JWT_Token', response.token);
          this.isLoggedIn = true;
          return true;
        }),
        catchError(error => {
          console.log(error);
          this.isLoggedIn = false;
          return of(false);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('JWT_Token');
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
