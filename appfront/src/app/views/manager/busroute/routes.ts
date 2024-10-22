import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'busroutes',
    data: {
      title: 'Bus Routes'
    },
    children: [
      {
        path: '',
        redirectTo: 'busroute',
        pathMatch: 'full'
      },
      {
        path: 'addroute',
        loadComponent: () => import('./addroute/addroute.component').then(m => m.AddrouteComponent),
        data: {
          title: 'Add Route'
        }
      },
      {
        path: 'editroute/:routeId',
        loadComponent: () => import('./editroute/editroute.component').then(m => m.EditrouteComponent),
        data: {
          title: 'Edit Route'
        }
      },
      {
        path: 'deleteroute/:routeId',
        loadComponent: () => import('./deleteroute/deleteroute.component').then(m => m.DeleterouteComponent),
        data: {
          title: 'Delete Route'
        }
      }
    ]
  }
];


