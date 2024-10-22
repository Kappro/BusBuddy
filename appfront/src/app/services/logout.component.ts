import {Component, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-logout',
  imports: [RouterOutlet],
  template: '',
  standalone: true
})
export class LogoutComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.logout();
    this.router.navigate(['']).then(
      result => {
        console.log("Logout " + result);
      }
    ).catch(
      error => {
        console.error("Logout failed " + error);
      }
    );
  }
}
