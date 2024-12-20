import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {JwtInterceptor} from "./services/auth.interceptor";
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule, Title} from "@angular/platform-browser";
import {ColorModeService} from "@coreui/angular";
import {IconSetService} from "@coreui/icons-angular";
import {iconSubset} from "./icons/icon-subset";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {delay, filter, map, tap} from "rxjs";

/**
 * Entry point of Angular app.
 */
@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive
  ]
})
export class AppComponent implements OnInit {
  /**
   * Title of our app!
   */
  title = 'BusBuddy';

  /**
   * @ignore
   */
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  /**
   * @ignore
   */
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  /**
   * @ignore
   */
  readonly #router = inject(Router);
  /**
   * @ignore
   */
  readonly #titleService = inject(Title);

  /**
   * @ignore
   */
  readonly #colorModeService = inject(ColorModeService);
  /**
   * @ignore
   */
  readonly #iconSetService = inject(IconSetService);

  /**
   * @ignore
   */
  constructor() {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

  /**
   * @ignore
   */
  ngOnInit(): void {

    console.log(localStorage.getItem('AccessToken'))

    this.#router.events.pipe(
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

}
