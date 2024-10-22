import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../icons/icon-subset';
import { DeploymentComponent } from './deployment.component';

describe('TabsComponent', () => {
  let component: DeploymentComponent;
  let fixture: ComponentFixture<DeploymentComponent>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentComponent, NoopAnimationsModule],
      providers: [IconSetService],
      teardown: { destroyAfterEach: false }   // <- add this line for Error: NG0205: Injector has already been destroyed.
    }).compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(DeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
