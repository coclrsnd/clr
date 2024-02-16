import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from 'src/app/app-constants';
import { SavedSearchService } from 'src/app/services/saved-search.service';
import { SaveSearchModel } from 'src/app/shared/models/save-search.model';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.scss']
})
export class SearchDetailsComponent implements OnInit {
  // Variable declearations
  public displayedColumnsDetails: string[] = ['select', 'Name', 'LastRun'];
  public dataSource:any;
  public selectedValues: any[];
  selection = new SelectionModel(true, []); // For Grid selection
  constructor(private savedSearchService :SavedSearchService, public router: Router) { }

  ngOnInit(): void {
    this.GetAllSavedSearch();
  }

  /**
   * function to log selected search records
  */

  logSelection() {

}

GetAllSavedSearch(){
  this.savedSearchService.GetAllSavedSearch().subscribe(data =>{
    this.dataSource=data;
  });
}

onSavedSearchClick(selectedRow:SaveSearchModel){
  this.router.navigateByUrl(selectedRow.NavigateUrl, { state :selectedRow});
}
}
