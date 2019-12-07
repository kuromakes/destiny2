import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinyLeaderboardsComponent } from './destiny-leaderboards.component';

describe('DestinyLeaderboardsComponent', () => {
  let component: DestinyLeaderboardsComponent;
  let fixture: ComponentFixture<DestinyLeaderboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinyLeaderboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinyLeaderboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
