import { AbstractControl, ValidatorFn } from "@angular/forms";
import { APP_CONSTANTS } from "src/app/app-constants";
import { DatePipe } from '@angular/common';

export class DateValidators {
  static datePipe:DatePipe=new DatePipe('en-US');
  static dateLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
      return (c: AbstractControl): { [key: string]: boolean } | null => {
          const date1 = c.get(dateField1)?.value;
          const date2 = c.get(dateField2)?.value;
          if ((date1 !== null && date2 !== null) && date1 > date2) {
              return validatorField;
          }
          return null;
      };
  }
  static dateIsLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if((dateField1=== 'EffectiveDate' && dateField2 ==='ExpiryDate') ||
        (dateField1=== 'ArrivalDate' && dateField2 ==='DepartureDate'))
        {
          const date1 = c.get(dateField1)?.value;
          const date2 = c.get(dateField2)?.value;
          if ((date1 !== APP_CONSTANTS.emptyString && date2 !== APP_CONSTANTS.emptyString) &&
          this.convertToDate(date1) > this.convertToDate(date2)) {
              return validatorField;
          }
      }
      return null;
    };
}
static convertToDate(inputValString:string): any{
  if(inputValString!=undefined && inputValString!=null && inputValString!=''){
    return new Date(this.datePipe.transform(inputValString, "yyyy/MM/dd") || '');
  }
}
static dateLessThanOrEquals(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1 = c.get(dateField1)?.value;
      const date2 = c.get(dateField2)?.value;
      if ((date1 !== null && date2 !== null) && date1 >= date2) {
          return validatorField;
      }
      return null;
  };
}
}

export class NumValidators {
  static numLessThan(numField1: string, numField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
      return (c: AbstractControl): { [key: string]: boolean } | null => {
          const number1 = c.get(numField1)?.value;
          const number2 = c.get(numField2)?.value;
          if ((number1 !== null && number2 !== null) && number1 > number2) {
              return validatorField;
          }
          return null;
      };
  }
}

export class equalValidators {
  static fieldEqual(Field1: string, Field2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        const number1 = c.get(Field1)?.value;
        const number2 = c.get(Field2)?.value;
        if ((number1 !== APP_CONSTANTS.emptyString && number2 !== APP_CONSTANTS.emptyString) && number1 !== number2) {
            return validatorField;
        }
        return null;
    };
}
}
