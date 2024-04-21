import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrintingService {
  constructor() {}

  printDocument(elementId: string): void {
    const printContents = document.getElementById(elementId)?.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents; // Restore original content
  }
}
