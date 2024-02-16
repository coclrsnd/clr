import { Injectable, PipeTransform } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MasterDataService } from '../services/master-data.service';
import { CountryModel } from './models/country-model.model';
import { RegionModel } from './models/region.model';
import { StateModel } from './models/state-model.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { APP_CONSTANTS } from '../app-constants';
import { Observable } from 'rxjs';
import { ContractRateTypeModel } from './models/contractratetype.model';
import { PercentPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public currentTitleSubject$ = new BehaviorSubject('Title');
  public changedTitleName = this.currentTitleSubject$.asObservable();
  public currentOpenedMenus$ = new BehaviorSubject([]);
  public changedMenus = this.currentTitleSubject$.asObservable();

  public CountryList: CountryModel[] = [];
  public StateList: StateModel[] = [];
  public RegionsList: RegionModel[] = [];
  public RateTypes: ContractRateTypeModel[] = [];
  public datePipe: DatePipe = new DatePipe('en-US');

  constructor(
    private masterDataService: MasterDataService,
    private percentPipe: PercentPipe
  ) {

  }

  public changeTitle(newTitle: any) {
    this.currentTitleSubject$.next(newTitle);
  }

  public openedMenus(newMenu: any) {
    this.currentOpenedMenus$.next(newMenu);
  }

  public resetField(
    inputForm: UntypedFormGroup,
    controlName: string,
    valueToSet: number
  ) {
    inputForm.get(controlName)?.setValue(valueToSet);
  }

  public CheckIsEmpty(input: any): any {
    if (input === undefined || input === null || input === '') {
      return null;
    }
    return parseInt(input.toString().replace('$',''));
  }

  public CheckDecimalIsEmpty(input: any): any {
    if (input === undefined || input === null || input === '') {
      return null;
    }
    return parseFloat(input.toString().replace('$','').replace('%',''));
  }

  public ConvertToDecimal(input: any): number {
    if (input === undefined || input === null || input === '') {
      return 0;
    }
    return parseFloat(input.toString().replace('$','').replace('%',''));
  }
  /** on update customer form data
   * @method CheckIfEmptyOrNull
   * @param inputVal - input string that needs to validate
   */
  public CheckIfEmptyOrNull(inputVal: string): string {
    if (inputVal === undefined || inputVal === null || inputVal === '') {
      return '';
    }
    return inputVal.toString();
  }

  /** on update customer form data
   * @method getProfileName
   * @param firstName - first name of the user
   * @param lastName - last name of the user
   * @returnn string - profile name of the user
   */
  public getProfileName(firstName: string, lastName: string): string {
    let userProfileName: string = '';

    if (firstName && firstName != '' && lastName && lastName != '') {
      userProfileName =
        firstName.toUpperCase().substring(0, 1) +
        lastName.toUpperCase().substring(0, 1);
    } else if ( firstName && firstName != '' && lastName && lastName == '') {
      userProfileName = firstName.toUpperCase().substring(0, 2);
    } else if (firstName === '' && lastName !== '') {
      userProfileName = lastName.toUpperCase().substring(0, 2);
    } else {
      userProfileName = '-';
    }
    return userProfileName;
  }

  /** Load master data of country, state & Region.
   * @method loadMasterData
   */
  public loadMasterData(): void {
    this.getCountryList();
    this.getStatesList();
    this.getRegionsList();
  }

  /** Get All Country Data
   * @method getCountryList
   */

  public getCountryList(): Observable<CountryModel[]> {
    if (this.CountryList.length == 0) {
      let responseData = this.masterDataService.getCountryList();
      responseData.subscribe((response) => { this.CountryList = response })
      return responseData;
    } else {
      return Observable.create(observer => { observer.next(this.CountryList) });
    }
  }

  /** Get All State Data
   * @method getStatesList
   */

  public getStatesList(): Observable<StateModel[]> {
    if (this.StateList.length == 0) {
      let responseData = this.masterDataService.getStateListByCountryId(0);
      responseData.subscribe((response) => { this.StateList = response })
      return responseData;
    }
    return Observable.create(observer => { observer.next(this.StateList) })
  }

  /** Get All Region Data
   * @method getRegionsList
   */
  public getRegionsList(): Observable<RegionModel[]>  {
    if (this.RegionsList.length == 0) {
      let responseData = this.masterDataService.getregionList();
      responseData.subscribe((response) => { this.RegionsList = response });
      return responseData;
    }
    return Observable.create(observer => { observer.next(this.RegionsList) })

  }

  public toUpperCase(event): string {
    if ((/^[a-zA-Z1-9- ]+$/).test(event.target.value)) {
      return event.target.value.toUpperCase();
    } else {
      return event.target.value;
    }
  }

  /** Convert selecte date to format so API can processed it
   * @method ConvertToFormatedDate
   */
  public ConvertToFormatedDate(selectedDate: any) : any {
   return this.datePipe.transform(selectedDate, 'yyyy/MM/dd');
  }

  /** Convert date receive through API to local date for DatePciker
   * @method ConvertToDatePickerDate
   */
   public ConvertToDatePickerDate(selectedDate: any) : any {
    if(selectedDate!=undefined && selectedDate!=null && selectedDate!=''){
      return new Date(this.datePipe.transform(selectedDate, APP_CONSTANTS.DefaultDateTimeFormat) || '');
    }
   return null;
  }

/** Get All Storage Order contract Rate Types
   * @method getContractRateTypes
   */
 public getContractRateTypes(): Observable<ContractRateTypeModel[]> {
  if (this.RateTypes.length == 0) {
    let responseData = this.masterDataService.GetContractRateTypes();
    responseData.subscribe((response) => { this.RateTypes = response });
    return responseData;
  }
  return Observable.create(observer => { observer.next(this.RateTypes) });
}

/** Add percentage to the current value
   * @method onValueConversionToPercentage
   */
onValueConversionToPercentage(val: any) {
  return (this.percentPipe.transform(val.replace(/[^0-9\.]+/g,"")/100,'1.1-2'));
}

 /** Check if newly added rates detail is correct or not
   * @method transformFieldValues
   * @param fields Array of field name that are required to trnsform in to specific format.
   * @param form Formgroup object in which we want to transform fields.
   * @param converter type of format that we want to convert the control value.
   */
  public transformFieldValues(fields: any, form: UntypedFormGroup, converter: PipeTransform): void {
    Object.keys(form.controls).forEach((key: string) => {
      const control = form.controls[key];
      if (control instanceof UntypedFormGroup) {
        this.transformFieldValues(fields, control, converter);
      } else {
        if (fields.find(e => e == key)) {
          if (converter instanceof CurrencyPipe) {
            if ((control.value || control.value === 0) && control.value !== APP_CONSTANTS.null) {
              if (typeof (control.value) === 'number') {
                const formattedAmount = converter.transform(control.value, 'USD');
                control.patchValue(formattedAmount);
              }
            }
          }
          else if (converter instanceof PercentPipe) {
            if ((control.value || control.value === 0) && control.value !== APP_CONSTANTS.null) {
              const formattedPercent = converter.transform(control.value / 100, '1.1-2');
              control.patchValue(formattedPercent, { emitEvent: true, onlySelf: true });
            }
          }
        }
      }
    });
  }

  /** Check if newly added rates detail is correct or not
   * @method transformFieldValues
   * @param fields Array of field name that are required to trnsform in to specific format.
   * @param form Formgroup object in which we want to transform fields.
   * @param converter type of format that we want to convert the control value.
   */
  public ValidatSelectControl(fields: any, form: UntypedFormGroup): void {
    Object.keys(form.controls).forEach((key: string) => {
      const control = form.controls[key];
      if (control instanceof UntypedFormGroup) {
        this.ValidatSelectControl(fields, control);
      } else {
        if (fields.find(e => e == key)) {
          if (!isNaN(Number.parseFloat(form.controls[key].value)) && form.controls[key].value === 0 || form.controls[key].value === APP_CONSTANTS.null || form.controls[key].value === APP_CONSTANTS.emptyString)
            form.controls[key].setErrors({ 'defaultValue': true });
        }
      }
    });
  }
}
