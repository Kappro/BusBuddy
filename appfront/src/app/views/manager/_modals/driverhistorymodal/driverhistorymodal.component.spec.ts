import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedrivermodalComponent } from './driverhistorymodal.component';

describe('ChangedrivermodalComponent', () => {
  let component: ChangedrivermodalComponent;
  let fixture: ComponentFixture<ChangedrivermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangedrivermodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangedrivermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
