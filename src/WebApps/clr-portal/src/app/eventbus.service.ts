import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventbusService {

  constructor() { }
  public sidenavClose: EventEmitter<void> = new EventEmitter();
}
