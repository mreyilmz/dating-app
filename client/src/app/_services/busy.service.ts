import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private busyRequestCount = 0;

  busy() {
    this.busyRequestCount++;
  }

  idle() {
    this.busyRequestCount--;
  }

  getRequestCount() {
    return this.busyRequestCount;
  }
}
