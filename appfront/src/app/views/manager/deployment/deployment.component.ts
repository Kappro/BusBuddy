import { Component, signal } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { BorderDirective, CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective,     TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  BadgeModule } from '@coreui/angular';

interface IRequest {
  requestId: number,
  serviceNo: string,
  driverId: string,
  driverName: string,
  busLicensePlate: string,
  dateTimeStart: string,
  currentStatus: string, // for now
  dateTimeEnd: string
}

@Component({
    selector: 'app-deployment',
    templateUrl: './deployment.component.html',
    styleUrls: ['./deployment.component.scss'],
    standalone: true,
    imports: [ TabPanelComponent, TabDirective, BadgeModule,
      TabsComponent,
      TabsContentComponent,
      TabsListComponent, BorderDirective, CardHeaderComponent, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective]
})
export class DeploymentComponent {

  public requests: IRequest[] = [
    {
      requestId: 1,
      serviceNo: '179',
      driverId: '5',
      driverName: 'Moo Deng',
      busLicensePlate: 'SBS1234A',
      dateTimeStart: '9-Oct-2024 12:00',
      currentStatus: 'Completed', // for now
      dateTimeEnd: '9-Oct-2024 13:00'
    },
    {
      requestId: 2,
      serviceNo: '179a',
      driverId: '6',
      driverName: 'Pesto',
      busLicensePlate: 'SBS9876B',
      dateTimeStart: '9-Oct-2024 12:00',
      currentStatus: 'PreDeployment', // for now
      dateTimeEnd: ''
    },
    {
      requestId: 3,
      serviceNo: '179b',
      driverId: '5',
      driverName: 'Moo Deng',
      busLicensePlate: 'SBS1234A',
      dateTimeStart: '9-Oct-2024 15:00',
      currentStatus: 'BufferTime', // for now
      dateTimeEnd: ''
    },
    {
      requestId: 4,
      serviceNo: '199',
      driverId: '3',
      driverName: 'Clark Kent',
      busLicensePlate: 'SBS4782C',
      dateTimeStart: '9-Oct-2024 15:00',
      currentStatus: 'Cancelled', // for now
      dateTimeEnd: '9-Oct-2024 15:01'
    },
    {
      requestId: 5,
      serviceNo: '199',
      driverId: '3',
      driverName: 'Clark Kent',
      busLicensePlate: 'SBS4782C',
      dateTimeStart: '9-Oct-2024 15:00',
      currentStatus: 'Ongoing', // for now
      dateTimeEnd: ''
    },
    {
      requestId: 6,
      serviceNo: '179',
      driverId: '4',
      driverName: 'Diana Prince',
      busLicensePlate: 'SBS1392A',
      dateTimeStart: '9-Oct-2024 15:00',
      currentStatus: 'Ongoing', // for now
      dateTimeEnd: ''
    },
    {
      requestId: 7,
      serviceNo: '199',
      driverId: '2',
      driverName: 'Tom',
      busLicensePlate: 'SBS2888A',
      dateTimeStart: '9-Oct-2024 12:00',
      currentStatus: 'Completed', // for now
      dateTimeEnd: '9-Oct-2024 14:00'
    }
  ];

  activeItem = signal(0);

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

}
