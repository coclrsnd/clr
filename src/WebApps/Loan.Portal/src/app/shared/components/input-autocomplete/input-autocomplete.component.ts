import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
} from '@angular/core'
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormControl,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { coerceNumberProperty } from '@angular/cdk/coercion';

import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { APP_CONSTANTS } from 'src/app/app-constants';

/**
 * Validates if the value passed has a code in order to be declared as an
 * object provided by material autocomplete options
 */
 function isAutocompleteOption(value: any): boolean {
  if (!value || typeof value === 'string') return false;
  return value.id > 0;
}

/**
 * Validates the control value to have an `id` attribute. It is expected
 * control value to be an object.
 */
 function containsIdValidation(control: AbstractControl): ValidationErrors {
  return isAutocompleteOption(control.value) ? { some: false } : { required: true };
}

@Component({
  selector: 'app-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAutocompleteComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() placeholder: string;
  @Input() options;
  @Input() renderTemplate;

  // Inner form control to link input text changes to mat autocomplete
  inputControl = new UntypedFormControl('', this.validators)
  searchResults: Observable<any>
  noResults = false
  isSearching = false

  private _lengthToTriggerSearch = 3;
  public currentDropdownTemplate: any;

  @Input()
  set lengthToTriggerSearch(value: number) {
    this._lengthToTriggerSearch = coerceNumberProperty(value, 0)
  }

  constructor(
    @Optional() @Self() private controlDir: NgControl,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this
    }
  }

  ngOnInit() {
    if (this.controlDir) {
      // Set validators for the outer ngControl equals to the inner
      const control = this.controlDir.control;
      const validators = control.validator
        ? [control.validator, this.inputControl.validator]
        : this.inputControl.validator;
      control.setValidators(validators);
      // Update outer ngControl status
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const isOptions = changes['options'];
    if (isOptions) {
      if (this.isSearching) {
        this.isSearching = false
        if (
          !isOptions.firstChange &&
          !isOptions.currentValue.length
        ) {
          this.noResults = true
        } else {
          this.noResults = false
        }
      }
    }
  }

  /**
   * Allows Angular to update the inputControl.
   * Update the model and changes needed for the view here.
   */
  writeValue(obj: any): void {
    obj && this.inputControl.setValue(obj)
  }

  /**
   * Allows Angular to register a function to call when the inputControl changes.
   */
  registerOnChange(fn: any): void {
    // Pass the value to the outer ngControl
    this.inputControl.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        if (typeof value === 'string') {
          if (this.isMinLength(value)) {
            this.isSearching = true;
            this.changeDetectorRef.detectChanges();
            fn(value.toUpperCase());
          } else {
            this.isSearching = false;
            this.noResults = false;
            fn(null);
          }
        } else {
          fn(value);
        }
      },
    })
  }

  /**
   * Allows Angular to register a function to call when the input has been touched.
   * Save the function as a property to call later here.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  /**
   * Allows Angular to disable the input.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable() : this.inputControl.enable()
  }

  /**
   * Function to call when the input is touched.
   */
  onTouched() {}

  /**
   * Method linked to the mat-autocomplete `[displayWith]` input.
   * This is how result name is printed in the input box.
   */
  displayFn(result: any): string {
    if (typeof result === 'string') {
      return result ? result : '';
    } else if (typeof result === 'object') {
      switch(this.renderTemplate) {
        case APP_CONSTANTS.cityState:
          return result.Address ? result.Address.City + ', ' + result.Address.State : '';
          break;
        case APP_CONSTANTS.onlyName:
          return result.Name
          break;
        default:
          return result ? result : '';
      }
    } else {
      return result ? result : '';
    }
  }

  isMinLength(value: string) {
    return value.length >= this._lengthToTriggerSearch
  }

  // Here you can add additional validations if required like [Validators.required, containsIdValidation];
  private get validators(): ValidatorFn[] {
    return [Validators.required];
  }
}


/*
Using this common utility
Declearation In HTML
<label for="Vendor" class="required">{{'rider.vendor' | translate}}</label>
<app-input-autocomplete formControlName="Vendor" placeholder="Please enter Vendor" [options]="pokemons$ | async">
</app-input-autocomplete>

define as observable
 public pokemons$:  Observable<any> | undefined;

Add in form control
        pokemon: new FormControl(),

execute in oninit after form declearation

    this.defineNewAutocomplete();

decleare a method
public defineNewAutocomplete(): void {
   this.pokemons$ = this.riderDetailsForm.get("Vendor")?.valueChanges.pipe(
    startWith(null),
    switchMap((name) => {
      if (typeof name === "string") {
        return of(this.vendor).pipe(
          delay(500),
          map((response) =>
            response.filter((p) => p.Name.toUpperCase().includes(name))
          )
        )
      }
      return of([])
    })
  )
}
*/
