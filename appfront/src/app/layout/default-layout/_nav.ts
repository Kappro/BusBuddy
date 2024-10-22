import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Requests',
    url: '/manager/request',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Manage'
  },
  {
    name: 'Bus Drivers',
    url: '/manager/busdrivers',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Bus Routes',
    url: '/manager/busroutes',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Deployments',
    url: '/manager/deployment',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Misc',
    title: true
  },
  {
    name: 'Register',
    url: '/manager/register',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  }
];
