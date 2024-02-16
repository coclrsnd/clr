import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MultiSelectComponent {

  @Input() FormControlModel: any;
  @Input() InputValues:string[] = [];
  @Input() SelectAllText = 'Select All';

  constructor() {
  }

  isChecked(): boolean {
    return this.FormControlModel.value && this.InputValues.length
      && this.FormControlModel.value.length === this.InputValues.length;
  }

isIndeterminate(): boolean {
  return this.FormControlModel.value && this.InputValues.length && this.FormControlModel.value.length
    && this.FormControlModel.value.length < this.InputValues.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.FormControlModel.setValue(this.InputValues);
    } else {
      this.FormControlModel.setValue([]);
    }
  }

}
