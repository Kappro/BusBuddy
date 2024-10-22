import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../icons/icon-subset';
import { BusroutesComponent } from './busroutes.component';

describe('TabsComponent', () => {
  let component: BusroutesComponent;
  let fixture: ComponentFixture<BusroutesComponent>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusroutesComponent, NoopAnimationsModule],
      providers: [IconSetService],
      teardown: { destroyAfterEach: false }   // <- add this line for Error: NG0205: Injector has already been destroyed.
    }).compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(BusroutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
