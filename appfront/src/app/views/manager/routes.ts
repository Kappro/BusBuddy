import { Routes } from '@angular/router';

export const ManagerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'request',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register'
    }
  },
  {
    path: 'request',
    loadComponent: () => import('./request/request.component').then(m => m.RequestComponent),
    data: {
      title: 'Request'
    }
  },
  {
    path: 'busdrivers',
    loadComponent: () => import('./busdrivers/busdrivers.component').then(m => m.BusdriversComponent),
    data: {
      title: 'Bus Drivers'
    }
  },
  {
    path: 'busroutes',
    loadComponent: () => import('./busroute/busroutes.component').then(m => m.BusRoutesComponent),
    data: {
      title: 'Bus Routes'
    }
  },
  {
    path: 'deployment',
    loadComponent: () => import('./deployment/deployment.component').then(m => m.DeploymentComponent),
    data: {
      title: 'Deployment'
    }
  }
]
