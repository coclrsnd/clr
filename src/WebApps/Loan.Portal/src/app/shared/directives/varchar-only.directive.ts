import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appVarcharOnly]'
})
export class VarcharOnlyDirective {

  public key: any;
  public Regex='/^[^a-zA-Z0-9]*$/';
  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    //"-",
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete'
  ];
  constructor( private control: NgControl) {}
  @HostListener('keydown', ['$event']) onKeydown(event: any) {
    this.key = event.keyCode;
    if (!(this.specialKeys.indexOf(event.key) !== -1)) {

    }
  }
  @HostListener('blur', ['$event'])
  blur(e: any) {
    if ((/^[a-zA-Z0-9]+$/).test(e.target.value)) {
      this?.control?.control?.setValue(e.target.value);
    } else {
      this.control?.control?.setValue(null);
    }
  }

}
