import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskAadhar',
  standalone: true
})
export class MaskAadharPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    // Mask all but the last 4 digits of the Aadhar number
    return value.replace(/.(?=.{4})/g, '*');
  }

}
