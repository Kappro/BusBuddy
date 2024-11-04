import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelDeploymentModalComponent } from './confirmcanceldeployment.component';

describe('ChangedrivermodalComponent', () => {
  let component: ConfirmCancelDeploymentModalComponent;
  let fixture: ComponentFixture<ConfirmCancelDeploymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCancelDeploymentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCancelDeploymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
