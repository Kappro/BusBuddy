import {Component, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router, RouterOutlet} from "@angular/router";

/**
 * Logout component that immediately redirects users to login page on logout.
 */
@Component({
  selector: 'app-logout',
  imports: [RouterOutlet],
  template: '',
  standalone: true
})
export class LogoutComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * Executes logout and then immediately redirects user.
   */
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
