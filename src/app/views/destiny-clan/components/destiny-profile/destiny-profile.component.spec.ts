import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinyProfileComponent } from './destiny-profile.component';

describe('DestinyProfileComponent', () => {
  let component: DestinyProfileComponent;
  let fixture: ComponentFixture<DestinyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
