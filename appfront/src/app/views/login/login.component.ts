import { Component } from '@angular/core';
import {Access, Account} from "../../_models/account";
import { ApiService } from "../../services/api.service"
import { HttpClient } from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {Router, ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {TextColorDirective} from "@coreui/angular";
import {NgIf} from "@angular/common";

/**
 * Component that displays login page, the first page every user sees when entering the website.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    FormsModule,
    TextColorDirective,
    NgIf
  ],
  standalone: true
})
export class LoginComponent {
  /**
   * @ignore
   */
  email: string = '';
  /**
   * @ignore
   */
  password: string = '';
  /**
   * @ignore
   */
  access: string = '';
  /**
   * @ignore
   */
  failed: boolean = false;

  /**
   * @ignore
   */
  constructor(private apiservice: ApiService,
              private http: HttpClient,
              private authservice: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  /**
   * Uses email and password inputs to pass to AuthService to query backend for login. Shows error message if login failed, or redirects to respective page if successful.
   */
  onSubmit() {
    let params = {
      email: this.email,
      password: this.password,
    };
    this.authservice.login(params).subscribe({
      next: (message) => {
        if(message==='Error Logging In.') {
          this.failed = true;
        }
        this.authservice.retrieveIdentity().then(
          account => {
            if(account.access==Access.MANAGER) {
              this.router.navigate(['manager']).then(
                result => {
                  console.log("Redirect "+result);
                }
              ).catch(
                error => {
                  console.error("Redirect failed "+error);
                }
              );
            }
            else if(account.access==Access.DRIVER) {
              this.router.navigate(['driver']).then(
                result => {
                  console.log("Redirect "+result);
                }
              ).catch(
                error => {
                  console.error("Redirect failed "+error);
                }
              );
            }
          }
        );
      },
      error: (e) => {
        console.log('Error '+ e);
      }
    });
  }
}
