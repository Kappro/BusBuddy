import { Component } from '@angular/core';
import {Access, Account} from "../../_models/account";
import { ApiService } from "../../services/api.service"
import { HttpClient } from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {Router, ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  access: string = '';

  constructor(private apiservice: ApiService,
              private http: HttpClient,
              private authservice: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  onSubmit() {
    let params = {
      email: this.email,
      password: this.password,
    };
    this.authservice.login(params).subscribe({
      next: (message) => {
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
          }
        );
      },
      error: (message) => {
        console.log('Error ', message)
      }
    });
  }
}
