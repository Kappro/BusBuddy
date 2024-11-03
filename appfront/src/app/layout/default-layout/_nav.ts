import { INavData } from '@coreui/angular';

export const navItemsManager: INavData[] = [
  {
    title: true,
    name: 'Request'
  },
  {
    name: 'Requests',
    url: '/manager/request',
    iconComponent: { name: 'cil-bell' }
  },
  {
    title: true,
    name: 'Bus Deployment'
  },
  {
    name: 'Manage Deployments',
    url: '/manager/deployment',
    iconComponent: { name: 'cil-bus-alt' }
  },
  {
    title: true,
    name: 'Route Management'
  },
  {
    name: 'Manage Bus Routes',
    url: '/manager/busroutes',
    iconComponent: { name: 'cil-map' }
  },
  {
    name: 'Manage Bus Driver',
    title: true
  },
  {
    name: 'View Drivers',
    url: '/manager/busdrivers',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Register New Account',
    url: '/manager/register',
    iconComponent: { name: 'cil-user-follow' }
  }
];

export const navItemsDriver: INavData[] = [
  {
    title: true,
    name: 'Dashboard'
  },
  {
    name: 'Dashboard',
    url: '/driver/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Bus Driver'
  },
  {
    name: 'Overview',
    url: '/driver/overview',
    iconComponent: { name: 'cil-briefcase' }
  },
  {
    name: 'Driving History',
    url: '/driver/drivinghistory',
    iconComponent: { name: 'cil-book' }
  }
]
