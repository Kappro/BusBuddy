import { Routes } from '@angular/router';

export default [
  {
    path: '',
    data: {
      title: 'Driver'
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'overview',
        loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent),
        data: {
          title: 'Overview'
        }
      },
      {
        path: 'drivinghistory',
        loadComponent: () => import('./drivinghistory/drivinghistory.component').then(m => m.DrivingHistoryComponent),
        data: {
          title: 'Driving History'
        }
      }
    ]
  }
] satisfies Routes;
