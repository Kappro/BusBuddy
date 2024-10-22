import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddroutemodalComponent } from './addroutemodal.component';

describe('AddroutemodalComponent', () => {
  let component: AddroutemodalComponent;
  let fixture: ComponentFixture<AddroutemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddroutemodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddroutemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
