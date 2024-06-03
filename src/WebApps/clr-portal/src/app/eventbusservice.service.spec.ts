import { TestBed } from '@angular/core/testing';

import { EventbusserviceService } from './eventbusservice.service';

describe('EventbusserviceService', () => {
  let service: EventbusserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventbusserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
