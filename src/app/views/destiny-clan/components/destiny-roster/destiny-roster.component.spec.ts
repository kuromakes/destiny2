import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinyRosterComponent } from './destiny-roster.component';

describe('DestinyRosterComponent', () => {
  let component: DestinyRosterComponent;
  let fixture: ComponentFixture<DestinyRosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinyRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinyRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
