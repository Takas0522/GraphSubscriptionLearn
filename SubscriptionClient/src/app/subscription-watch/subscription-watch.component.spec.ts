import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionWatchComponent } from './subscription-watch.component';

describe('SubscriptionWatchComponent', () => {
  let component: SubscriptionWatchComponent;
  let fixture: ComponentFixture<SubscriptionWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionWatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
