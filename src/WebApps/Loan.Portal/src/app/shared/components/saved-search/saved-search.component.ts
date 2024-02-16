import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { APP_CONSTANTS } from 'src/app/app-constants';

@Component({
  selector: 'app-saved-search',
  templateUrl: './saved-search.component.html',
  styleUrls: ['./saved-search.component.scss'],
})
export class SavedSearchComponent implements OnInit {
  @Input() isSearchEnable: boolean;
  public searchFormGroup: UntypedFormGroup;
  @Output() isContentLoad: EventEmitter<boolean> = new EventEmitter();
  @Output() searchFormData: EventEmitter<any> = new EventEmitter();
  public isSavedSearchSubmit: boolean = false;

  constructor(public formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initilizeSaveSearchForm();
  }

  /** To Initialize save search from
   * @method initilizeSaveSearchForm
   */
  public initilizeSaveSearchForm(): void {
    this.searchFormGroup = this.formBuilder.group({
      NameYourSearch: [APP_CONSTANTS.emptyString, Validators.required],
      ExpiryDate: [APP_CONSTANTS.null, Validators.required],
    });
  }

  /** Get Current form-control
   * @method onSavedSearchForm
   */
  get onSavedSearchForm() {
    return this.searchFormGroup.controls;
  }

  /** When user click on back to search or cancel to save
   * @method onBackToSearch
   */
  public onBackToSearch(): void {
    this.isSavedSearchSubmit = false;
    this.searchFormGroup.reset();
    this.isContentLoad.emit(true);
  }

  /** When user click on Save all search detail
   * @method onRailCarSavedSearchClick
   */
  public onRailCarSavedSearchClick(): void {
    this.isSavedSearchSubmit = true;
    if (this.searchFormGroup.invalid) {
      return;
    }
    this.searchFormData.emit(this.searchFormGroup);
  }
}
