import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {LoginComponent} from "./views/login/login.component";
import {LoginGuardService, RoleGuardService} from "./services/auth.guard.service";
import {Access} from "./_models/account";
import {DefaultDriverLayoutComponent, DefaultManagerLayoutComponent} from "./layout";
import {LogoutComponent} from "./services/logout.component";

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuardService]
  },
  {
    path: 'manager',
    component: DefaultManagerLayoutComponent,
    data: {
      title: 'Manager',
      expectedRoles: [Access.MANAGER]
    },
    canActivate: [RoleGuardService],
    loadChildren: () => import("./views/manager/routes")
  },
  {
    path: 'driver',
    component: DefaultDriverLayoutComponent,
    data: {
      title: 'Driver',
      expectedRoles: [Access.DRIVER]
    },
    canActivate: [RoleGuardService],
    loadChildren: () => import("./views/driver/routes")
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      expectedRoles: [Access.MANAGER, Access.DRIVER]
    }
  }
];
