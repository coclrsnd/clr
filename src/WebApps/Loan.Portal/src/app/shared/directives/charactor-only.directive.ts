import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCharactorOnly]'
})
export class CharactorOnlyDirective {

  public key: any;
  public Regex='/^[^a-zA-Z]*$/';
  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
     " ",
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete'
  ];
  constructor( private control: NgControl) {}
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    this.key = event.keyCode;
    if (!(this.specialKeys.indexOf(event.key) !== -1)) {
      if ((this.key >= 15 && this.key <= 64) ||  (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
        event.preventDefault();
      }
    }
  }
  @HostListener('blur', ['$event'])
  blur(e: any) {

    if ((/^[a-zA-Z ]+$/).test(e.target.value)) {
      this?.control?.control?.setValue(e.target.value);
    } else {
      this.control?.control?.setValue(null);
    }
  }
}
