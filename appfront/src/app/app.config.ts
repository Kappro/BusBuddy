import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { appRoutes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {JwtInterceptor} from "./services/auth.interceptor";
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimations(),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ]
};
