import { AbstractControl } from '@angular/forms';

export function ValidateCarId(control: AbstractControl) {
  // if (!control.value.startsWith('https') || !control.value.includes('.io')) {
  //   return { ValidateCarId: true };
  // }
  // return null;
  return { ValidateCarId: true };
}
