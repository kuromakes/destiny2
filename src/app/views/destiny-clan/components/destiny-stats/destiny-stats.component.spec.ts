import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinyStatsComponent } from './destiny-stats.component';

describe('DestinyStatsComponent', () => {
  let component: DestinyStatsComponent;
  let fixture: ComponentFixture<DestinyStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinyStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
