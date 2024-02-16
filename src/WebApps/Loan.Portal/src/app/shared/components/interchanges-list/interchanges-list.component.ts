import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APP_CONSTANTS } from 'src/app/app-constants';

@Component({
  selector: 'app-interchanges-list',
  templateUrl: './interchanges-list.component.html',
  styleUrls: ['./interchanges-list.component.scss']
})
export class InterchangesListComponent implements OnInit, OnChanges {
@Input() getInterchangesForm: UntypedFormArray;
@Input() isInterchangeProcessOngoing;
@Input() configuration: any;
@Output() addInterchanges: EventEmitter<any> = new EventEmitter();
@Output() addLocationFromInterchange: EventEmitter<any> = new EventEmitter();
@Output() removeLocationFromInterchange: EventEmitter<any> = new EventEmitter();
@Output() removeInterchange: EventEmitter<any> = new EventEmitter();
@Output() isAddInterchangeProcess: EventEmitter<any> = new EventEmitter();
public innerDisplayedColumns = ['expand','Interchange', 'MarkCode', 'Locations', 'AddInterchange'];
public innerExpandedElements: any[] = [];
public dataSourceInnerInterchange: any;
public showAddInterchangeButton: boolean = true;
public isSaveInterchangeBtnEnabled: boolean = false;
  public parentComponentName: string = APP_CONSTANTS.InterchangesListComponent;
public IsEditInterchange: boolean = false;
  constructor(private toastr:ToastrService) { }

  ngOnInit(): void {
    this.dataSourceInnerInterchange = this.getInterchangesForm.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSourceInnerInterchange = this.getInterchangesForm.value;
  }

  /**To expand and collapse Interchange to view details
 * @method toggleInterchanges
 * @param interchange - selected interchange
 * @param i - index number of a toggled row
 */
 public toggleInterchanges(interchange: any, i: number): void {
   if(this.getInterchangesForm.valid){
    interchange.updateButton = false;
    // write discard logic with the help of below line in future
    this.getInterchangesForm.at(i).markAsUntouched();
      const index = this.innerExpandedElements.findIndex((x) => x === interchange);
      if (index === -1) {
        interchange.isExpanded = true;
        this.innerExpandedElements.push(interchange);
      } else {
        interchange.isExpanded = false;
        this.innerExpandedElements.splice(index, 1);
      }
    }
    else{
      this.toastr.error('Enter a valid SPLC.');
    }
   }


  /**To enable Interchange to be editable
 * @method onEditInterchanges
 * @param interchange - selected interchange
 */
  public onEditInterchanges(interchange: any): any {
   this.IsEditInterchange = true;
    if (!interchange.isExpanded) {
      const index = this.innerExpandedElements.findIndex((x) => x === interchange);
      interchange.isExpanded = true;
      interchange.updateButton = true;
      this.innerExpandedElements.push(interchange);
    } else if (this.innerExpandedElements.length) {
      interchange.updateButton = true;
    }
  }


 /**To add Interchange in the list
 * @method onAddInterchanges
 */
  public onAddInterchanges(): void {
     this.addInterchanges.emit(this.dataSourceInnerInterchange);
     this.isInterchangeProcessOngoing = true;
     this.isAddInterchangeProcess.emit(this.isInterchangeProcessOngoing);
   }


  /**To add Interchange in the list
 * @method onSaveInterchanges
 * @param event - true or false for event
 * @param element - currently selected interchange elemant
 * @param index - current rowIndex which is clicked / current iteration
 */
   public onSaveInterchanges(event: boolean, element, index) {
    this.toggleInterchanges(element, index);
   }

     /**To remove Interchange frome the list
 * @method onRemoveInterchanges
 * @param InterchangeIndex - index of interchange which needs to be removed
 */
   public onRemoveInterchanges(InterchangeIndex) {
    this.removeInterchange.emit(InterchangeIndex);
  }

  /**To remove the location from the interchange
 * @method onRemoveLocation
 * @param removeLocation - index of location which needs to be removed
 */
  public onRemoveLocation(removeLocation) {
    this.removeLocationFromInterchange.emit(removeLocation);
  }

  /**To add the location in the interchange
 * @method onAddLocation
 * @param LocationIndex - index of location which needs to be removed
 */
  public onAddLocation(LocationIndex) {
    this.addLocationFromInterchange.emit(LocationIndex);
  }
}
