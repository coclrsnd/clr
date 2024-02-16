import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { APP_CONSTANTS } from 'src/app/app-constants';
import { MasterDataService } from 'src/app/services/master-data.service';
import { CountryModel } from '../../models/country-model.model';
import { GeocodeStation } from '../../models/geocode-station.model';
import { RailRoadModel } from '../../models/rail-road.model';
import { StateModel } from '../../models/state-model.model';
import { SharedService } from '../../shared.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { debounceTime, switchMap, tap, finalize } from 'rxjs/operators';
@Component({
  selector: 'app-interchange-form',
  templateUrl: './interchange-form.component.html',
  styleUrls: ['./interchange-form.component.scss'],
})
export class InterchangeFormComponent implements OnInit {
  @Output() saveInterchanges: EventEmitter<any> = new EventEmitter<boolean>();
  @Output() isSetInterchangesProcessOpen: EventEmitter<any> =
    new EventEmitter<boolean>();
  @Output() removeInterchanges: EventEmitter<any> = new EventEmitter<boolean>();
  @Output() addLocation: EventEmitter<any> = new EventEmitter<boolean>();
  @Output() removeLocation: EventEmitter<any> = new EventEmitter<any>();
  @Input() isSaveInterchangeBtnEnabled: boolean;
  @Input() isUpdateInterchangeBtnEnabled: boolean;
  @Input() getInterchangesForm: UntypedFormGroup;
  @Input() currentIndex: number;
  @Input() totalInterchanges: number;
  @Input() parentComponentName: string;
  @Input() allInterchangesList: UntypedFormArray;
  @Input() IsEditInterchange: boolean;
  public InterchangesDetailsForm: UntypedFormGroup;
  public submittedInterchangesDetails: boolean = false;
  public effDateValue: Date = new Date();
  public expDateValue: Date = new Date();
  public unitList = APP_CONSTANTS.unitList;
  public railRoadList: RailRoadModel[] = [];
  public existingLocations: UntypedFormArray;

  defaultSelectedValueForDropdownlist: number = 0;
  defaultValueForDropdownlist: string = APP_CONSTANTS.emptyString;
  CountryList: CountryModel[] = [];
  StatesList: StateModel[] = [];

  //public GeoCodeDetails: GeocodeStation[] = [];
  public noResults: boolean = false;
  public isSearching: boolean = false;
  public selectedFacilityStateCode: string[] = [];
  public GeoStationsList: any[] = [];

  // public isInvalidInterchange: boolean = false;
  //public isInvalidInterchangeLocation:boolean=false;
  public filteredRailRoadList: RailRoadModel[] = [];
  public noRailRoadResults: boolean = false;

  constructor(
    public formBuilder: UntypedFormBuilder,
    private dialogService: ConfirmDialogService,
    private sharedService: SharedService,
    private masterDataService: MasterDataService
  ) {}
  ngOnInit(): void {
    let locationControls = (
      this.getInterchangesForm.controls['InterchangeLocations'] as UntypedFormArray
    ).controls;
    if (
      locationControls != null &&
      locationControls != undefined &&
      locationControls.length > 0
    ) {
      let i = 0;
      (
        this.getInterchangesForm.controls['InterchangeLocations'] as UntypedFormArray
      ).controls.forEach((formControl) => {
        this.loadCityList(formControl.get('City'), i);
        this.SetStateCodeOnStateChanged(formControl.get('StateId')?.value, i);
        i++;
      });
    }
    this.loadRailRoads(this.getInterchangesForm.get('RailRoadName'));
    this.loadMasterData();
    this.existingLocations =
      this.getInterchangesForm.value.InterchangeLocations;
  }

  private loadMasterData(): void {
    this.sharedService.getCountryList().subscribe((response) => {
      this.CountryList = response;
    });
    if (
      this.getInterchangesForm != undefined &&
      this.getInterchangesForm.value.Id > 0
    ) {
      this.sharedService.getStatesList().subscribe((response) => {
        this.StatesList = response;
      });
    }
    this.getRailRoads();
  }

  // convenience getter for easy access to Interchange form fields
  get InterchangesDetails() {
    return this.getInterchangesForm.controls;
  }

  // convenience getter for easy access to Location form fields
  get getLocationDetailsForm() {
    return (
      this.getInterchangesForm.controls['InterchangeLocations'] as UntypedFormArray
    ).controls;
  }

  /**On Railroad selection changed
   * @method onRailRoadSelection
   */
  onRailRoadSelection(event: any): void {
    let selectedRailRaodMarkCode = this.railRoadList.find(
      (t) => t.Id == event.value
    );
    if (selectedRailRaodMarkCode != undefined) {
      this.getInterchangesForm.patchValue({
        MarkCode: selectedRailRaodMarkCode?.MarkCode,
        RailRoadName: selectedRailRaodMarkCode?.Name,
      });
      this.CheckIfNewInterchangeIsValid();
    } else {
      this.getInterchangesForm.patchValue({
        MarkCode: APP_CONSTANTS.emptyString,
        RailRoadName: APP_CONSTANTS.emptyString,
      });
    }
  }

  /** Check if newly added interchange is valid or not
   * @method CheckIfNewInterchangeIsValid
   */
  private CheckIfNewInterchangeIsValid(): void {
    // this.isInvalidInterchange = false;
    if (
      this.allInterchangesList != undefined &&
      this.allInterchangesList != null
    ) {
      for (let i = 0; i < this.allInterchangesList.value.length; i++) {
        if (this.currentIndex != i) {
          let element = this.allInterchangesList.value[i];
          let currentMarkCode = this.getInterchangesForm.get('MarkCode')?.value;
          let currentRailRoad =
            this.getInterchangesForm.get('RailRoadName')?.value;
          if (
            this.sharedService.CheckIfEmptyOrNull(currentMarkCode) !=
              APP_CONSTANTS.emptyString &&
            this.sharedService.CheckIfEmptyOrNull(currentRailRoad) !=
              APP_CONSTANTS.emptyString &&
            element.MarkCode.trim().toLowerCase() ===
              currentMarkCode.trim().toLowerCase() &&
            element.RailRoadName.trim().toLowerCase() ===
              currentRailRoad.trim().toLowerCase()
          ) {
            // this.isInvalidInterchange = true;
            this.getInterchangesForm.controls['RailRoadName'].setErrors({
              notUnique: true,
            });
            break;
          } else {
            this.getInterchangesForm.controls['RailRoadName']?.setErrors(null);
          }
        }
      }
    }
  }

  /** Check if newly added SPLC (location) detail is valid/unique or not
   * @method CheckIfSPLCIsUnique
   */
  private CheckIfSPLCIsUnique(index: number): void {
    let previousValueOfCurrentElement = APP_CONSTANTS.emptyString;
    if (this.existingLocations.length > index) {
      previousValueOfCurrentElement = this.existingLocations[index].SPLC;
    }

    let currentSPLC = this.getLocationDetailsForm[index].value.SPLC;

    //this.isInvalidInterchangeLocation = false;
    if (
      this.getLocationDetailsForm != undefined &&
      this.getLocationDetailsForm != null
    ) {
      for (let i = 0; i < this.getLocationDetailsForm.length; i++) {
        let element = this.getLocationDetailsForm[i].value;
        if (
          this.sharedService.CheckIfEmptyOrNull(currentSPLC) !=
            APP_CONSTANTS.emptyString &&
          element.SPLC.toString().trim() === currentSPLC.toString().trim() &&
          index != i &&
          currentSPLC != previousValueOfCurrentElement
        ) {
          //this.isInvalidInterchangeLocation = true;
          this.getLocationDetailsForm[index].get('SPLC')?.setErrors({
            notUnique: true,
          });
          break;
        } else {
          this.getLocationDetailsForm[index].get('SPLC')?.setErrors(null);
        }
      }
    }
  }

  /**On Interchange form submit
   * @method onSubmitInterchangesForm
   */
  public onSubmitInterchangesForm(): void {
    // Logic to be enabled after complete development
    this.submittedInterchangesDetails = true;
    this.CheckIfNewInterchangeIsValid();
    this.CheckIfSPLCIsUnique(0);
    // stop here if form is invalid
    if (this.getInterchangesForm.invalid) {
      return;
    }
    this.saveInterchanges.emit(true);
    this.isSetInterchangesProcessOpen.emit(false);
  }

  /**On Interchange form update
   * @method onUpdateInterchangesForm
   */
  public onUpdateInterchangesForm(): void {
    this.CheckIfNewInterchangeIsValid();
    this.CheckIfSPLCIsUnique(0);
    if (this.getInterchangesForm.invalid) {
      return;
    }
    this.saveInterchanges.emit(true);
    this.isSetInterchangesProcessOpen.emit(false);
  }

  /**On remove Interchange by using index
   * @method onRemoveInterchange
   * @param index - emit an event with selected index to be removed
   */
  public onRemoveInterchange(index): void {
    this.removeInterchanges.emit(this.currentIndex);
  }

  /**On remove Location by using index
   * @method onRemoveLocation
   * @param index - emit an event with selected index to be removed by showing warning
   */
  public onRemoveLocation(index): void {
    const options = {
      title: 'Warning',
      message: `Are you sure you want to delete Location ${index + 1}?`,
      cancelText: 'No',
      confirmText: 'Yes',
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.removeLocation.emit(index);
      }
    });
  }

  /**To add Location by using index
   * @method onAddLocation
   * @param index - emit an event with selected index to be added
   */
  public onAddLocation(index: number): void {
    this.addLocation.emit(index);
    this.loadCityList(
      this.getLocationDetailsForm[index + 1].get('City'),
      index + 1
    );
  }

  /** On country selection changed
   * @method onCountrySelectionChanged
   * @param selectedCountry - country selected by user
   */
  public onCountrySelectionChanged(currentIndex: number): void {
    this.getLocationDetailsForm[currentIndex].patchValue({
      StateId: APP_CONSTANTS.emptyString,
    });
    let countryid =
      this.getLocationDetailsForm[currentIndex].get('CountryId')?.value;
    this.sharedService.getStatesList().subscribe((response) => {
      this.StatesList = response.filter(
        (t) => t.CountryId == countryid?.toString()
      );
    });
  }

  /** Load all state whene user change country
   * @method getAllStates
   * @param countryID - selected country id
   */
  public getAllStates(countryID: number, currentIndex: number) {
    if (countryID) {
    this.sharedService.getStatesList().subscribe((response) => {
    this.StatesList= response.filter(
        (t) => t.CountryId == countryID?.toString()
      );
    });
    } else {
      this.getLocationDetailsForm[currentIndex].patchValue({
        StateId: APP_CONSTANTS.emptyString,
      });
    }
  return this.StatesList;

  }

  /** To load Geocode stations on autocomplete (min 4 character required to enter)
   * @method loadCityList
   */
  public loadCityList(
    orgControl: AbstractControl | null,
    currentIndex: number
  ): void {
    if (orgControl) {
      orgControl?.valueChanges
        .pipe(
          debounceTime(1000),
          tap(() => {
             // this.GeoStationsList[currentIndex] = [];
          }),
          switchMap((value) =>
            this.filterGeoCodeStations(value, currentIndex).pipe(
              finalize(() => {
                if (
                  value.length > 1 &&
                  this.GeoStationsList[currentIndex].length === 0
                ) {
                  this.noResults = true;
                } else {
                  this.noResults = false;
                }
                this.isSearching = false;
              })
            )
          )
        )
        .subscribe((data: any) => {
          if (data != null && data.length > 0) {
            this.noResults = false;
            //this.GeoCodeDetails = data;
            this.GeoStationsList[currentIndex] = data;
          }
          // else{
          //   this.noResults=true;
          // }
        });
    }
  }

  /** To filter (when user start typing) and load Geocode stations from API based on user input
   * @method filterGeoCodeStations
   * @param val - entered city text
   */
  public filterGeoCodeStations(
    cityText: any,
    currentIndex: number
  ): Observable<GeocodeStation[]> {
    let geoCodesList = JSON.parse(
      JSON.stringify(this.GeoStationsList[currentIndex])
    );
    if (
      this.sharedService.CheckIfEmptyOrNull(cityText) != '' &&
      cityText.length > APP_CONSTANTS.SPLCAutoCompleteMinCharLength
    ) {
      this.isSearching = true;
      if (
        this.selectedFacilityStateCode[currentIndex] !=
        APP_CONSTANTS.emptyString
      ) {
        return this.masterDataService.GetGeoCodeStationDetail(
          cityText,
          this.selectedFacilityStateCode[currentIndex],
          this.getInterchangesForm.value.MarkCode
        );
      }
      return of(geoCodesList);
    } else {
      this.noResults = false;
      return of([]);
    }
  }

  /** On selected state value changed
   * @method onStateSelectionChanged
   * @param selectedState - selected country
   */
  public onStateSelectionChanged(
    selectedState: any,
    currentIndex: number
  ): void {
    this.SetStateCodeOnStateChanged(selectedState.value, currentIndex);
    // this.GeoCodeDetails = [];
    // let stateMasterData = JSON.parse(JSON.stringify(SharedService.StateList));
    // this.selectedFacilityStateCode[currentIndex] = stateMasterData.filter(
    //   (t) => t.Id == selectedState.value.toString()
    // )[0]?.Code;
  }

  /** Set State Code on State selection changed
   * @method SetStateCodeOnStateChanged
   * @param selectedStateId - selected state
   */
  public SetStateCodeOnStateChanged(
    selectedStateId: any,
    currentIndex: number
  ): void {
    if (
      this.sharedService.CheckIfEmptyOrNull(selectedStateId) != '' &&
      selectedStateId > 0
    ) {
      this.GeoStationsList[currentIndex] = [];
      this.sharedService.getStatesList().subscribe((response) => {
        this.selectedFacilityStateCode[currentIndex] = response.filter(
          (t) => t.Id == selectedStateId.toString()
        )[0]?.Code;
      });
    }
  }

  /** On select Location City/Station
   * @method onStationSelection
   * @param event: get current control detail
   * @param currentIndex: Current control index in the list of location
   */
  public onStationSelection(event: any, currentIndex: number): void {
    if (event.option.value.trim() != '') {
    if(this.GeoStationsList[currentIndex].length==0)
    {
      this.loadCityList(event.option.value.trim(),currentIndex);
    }
      this.setStationDetail(event.option.value.trim(), currentIndex);
      this.AfterSPLCValueChange(currentIndex);
    }
  }

  /** On Location City/Station selection changed
   * @method OnStationSelectionChanged
   * @param event: get current control detail
   * @param currentIndex: Current control index in the list of location
   */
  public OnStationSelectionChanged(event: any, currentIndex: number): void {
    if (event.target.value.trim() != '') {
      if(this.GeoStationsList[currentIndex].length==0)
      {
        this.loadCityList(event.target.value.trim(),currentIndex);
      }
      this.setStationDetail(event.target.value.trim(), currentIndex);
      this.AfterSPLCValueChange(currentIndex);
    }
  }

  /** Set selected station code
   * @method setStationDetail
   * @param selectedStationName: selected location city/station name
   * @param currentIndex: Current control index in the list of location
   */
  private setStationDetail(
    selectedStationName: string,
    currentIndex: number
  ): void {
    let selectedStationsList = JSON.parse(
      JSON.stringify(this.GeoStationsList[currentIndex])
    );
    let geoCodeData = selectedStationsList.filter(
      (t) => t.StationName == selectedStationName
    )[0];
    if (geoCodeData != undefined && geoCodeData != null) {
      this.disableFieldOnStationSelection(currentIndex);
      (
        this.getInterchangesForm.controls['InterchangeLocations'] as UntypedFormArray
      ).controls[currentIndex].patchValue({
        City: selectedStationName,
        SPLC: geoCodeData.SPLC,
        Lat: geoCodeData.Latitude,
        Long: geoCodeData.Longitude,
        R260: geoCodeData.R260,
        FSAC: geoCodeData.FSAC,
        IsTrimbleVerified: true,
      });
    } else {
      this.enableFieldOnStationSelection(currentIndex);
      (
        this.getInterchangesForm.controls['InterchangeLocations'] as UntypedFormArray
      ).controls[currentIndex].patchValue({
        City: selectedStationName,
        SPLC: APP_CONSTANTS.emptyString,
        Lat: APP_CONSTANTS.emptyString,
        Long: APP_CONSTANTS.emptyString,
        R260: APP_CONSTANTS.emptyString,
        FSAC: APP_CONSTANTS.emptyString,
        IsTrimbleVerified: false,
      });
    }
  }

  /** Convert textbox value to upperCase
   * @method onUpperCase
   * @param event: current control detail
   */
  public onUpperCase(event): void {
    event.target.value = this.sharedService.toUpperCase(event);
  }

  /** Disable Location detail on city/station selection
   * @method disableFieldOnStationSelection
   * @param currentIndex: Current control index in the list of location
   */
  private disableFieldOnStationSelection(currentIndex: number): void {
    this.getLocationDetailsForm[currentIndex].get('Lat')?.disable();
    this.getLocationDetailsForm[currentIndex].get('Long')?.disable();
    this.getLocationDetailsForm[currentIndex].get('R260')?.disable();
    this.getLocationDetailsForm[currentIndex].get('FSAC')?.disable();
  }

  /** Enable Location detail on city/station selection
   * @method enableFieldOnStationSelection
   * @param currentIndex: Current control index in the list of location
   */
  private enableFieldOnStationSelection(currentIndex: number): void {
    this.getLocationDetailsForm[currentIndex].get('Lat')?.enable();
    this.getLocationDetailsForm[currentIndex].get('Long')?.enable();
    this.getLocationDetailsForm[currentIndex].get('R260')?.enable();
    this.getLocationDetailsForm[currentIndex].get('FSAC')?.enable();
  }

  /** On blur event verify SPLC name
   * @method AfterSPLCValueChange
   */
  public AfterSPLCValueChange(index: number): void {
    this.CheckIfSPLCIsUnique(index);
  }
  private setSelectedRailRoad(railRoadId: number): void {
    let selectedRailRaodMarkCode = this.railRoadList.find(
      (t) => t.Id == railRoadId
    );
    if (selectedRailRaodMarkCode != undefined) {
      this.getInterchangesForm.patchValue({
        MarkCode: selectedRailRaodMarkCode?.MarkCode,
        RailRoadName: selectedRailRaodMarkCode?.Name,
        RailRoadId: railRoadId,
      });
      this.CheckIfNewInterchangeIsValid();
    } else {
      this.getInterchangesForm.patchValue({
        MarkCode: APP_CONSTANTS.emptyString,
        RailRoadName: APP_CONSTANTS.emptyString,
        RailRoadId: APP_CONSTANTS.defaultNumberValue,
      });
    }
  }

  public onRailRoadSelectionChanged(event: any) {
    if (
      event.option != undefined &&
      event.option.value != undefined &&
      event.option.value.Id > 0
    ) {
      this.setSelectedRailRoad(event.option.value.Id);
    }
  }

  public loadRailRoads(orgControl: AbstractControl | null): void {
    if (orgControl) {
      orgControl?.valueChanges
        .pipe(
          debounceTime(500),
          tap(() => {
            this.filteredRailRoadList = [];
          }),
          switchMap((value) => this.filterRailRoadData(value))
        )
        .subscribe((data: any) => {
          if (data != null && data.length > 0) {
            this.noRailRoadResults = false;
            this.filteredRailRoadList = data;
          }
        });
    }
  }

  /** To filter (when user start typing) and load Geocode stations from API based on user input
   * @method filterRailRoadData
   * @param val - entered city text
   */
  public filterRailRoadData(searchText: any): Observable<RailRoadModel[]> {
    let railRoadData = JSON.parse(JSON.stringify(this.railRoadList));
    if (
      this.sharedService.CheckIfEmptyOrNull(searchText) != '' &&
      searchText.length > 1
    ) {
      this.isSearching = true;
      if (railRoadData != undefined && railRoadData.length > 0) {
        let value = railRoadData.filter((t: RailRoadModel) =>
          t.Name.trim()
            .toLowerCase()
            .startsWith(searchText.trim().toLowerCase())
        );
        if (value != undefined && value.length > 0) {
          this.noRailRoadResults = false;
        } else {
          this.noRailRoadResults = true;
          this.getInterchangesForm.patchValue({
            MarkCode: APP_CONSTANTS.emptyString,
          });
        }
        this.isSearching = false;
        this.filteredRailRoadList = value;
        return value;
      }
      return of([]);
    } else {
      this.noRailRoadResults = false;
      // if (geoCodesList.length > 0) {
      //   return of(geoCodesList);
      // }
      return of([]);
    }
  }
  public onBlurRailRoad(event: any): void {
    this.noRailRoadResults = false;
    //this.isInvalidInterchange=false;
    let railRoadData = JSON.parse(JSON.stringify(this.railRoadList));
    let value = railRoadData.filter(
      (t: RailRoadModel) =>
        t.Name.trim().toLowerCase() === event.target.value.trim().toLowerCase()
    );
    if (value == undefined || value.length == 0) {
      this.getInterchangesForm.patchValue({
        MarkCode: APP_CONSTANTS.emptyString,
        RailRoadId: APP_CONSTANTS.defaultNumberValue,
      });
    } else {
      this.CheckIfNewInterchangeIsValid();
    }
  }

  /** Get All RailRoads Data
   * @method getRailRoads
   */
  private getRailRoads(): void {
    this.masterDataService.getRailRoadList().subscribe((response) => {
      this.railRoadList = response;
    });
  }
}
