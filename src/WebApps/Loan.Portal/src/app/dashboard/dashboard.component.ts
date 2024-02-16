import { Component, OnInit } from '@angular/core';
import { APP_CONSTANTS, single } from '../app-constants';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ChartType, ChartOptions, ChartDataset } from 'chart.js';
import { SharedService } from '../shared/shared.service';
import { SavedSearchService } from '../services/saved-search.service';
import { SaveSearchModel } from '../shared/models/save-search.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Variable declearations
  public numInfo = APP_CONSTANTS.numInfo;
  public single: any[];
  public view: any[] = [700, 400];
  // options
  public gradient: boolean = false;
  public showLegend: boolean = true;
  public showLabels: boolean = true;
  public isDoughnut: boolean = true;
  public legendPosition: string = 'below';
  public dataSource: any;
  public dataSourceDetails: any;
  public savedSearchDataSource :any;
  // options
  public showXAxis = true;
  public showYAxis = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Country';
  public showYAxisLabel = true;
  public yAxisLabel = 'Cars stored';
  public showDashboard = environment.showDashboard;
  public colorScheme = { domain: ['#888432', '#6283ac', '#6460a0', '#0b7077', '#34367c'] };
   public barChartcustomColors =
  [
    { name: "ABC Storage", value: '#888432' },
    { name: "Short Line RR", value: '#6283ac' },
    { name: "Big Store", value: '#6460a0' },
    { name: "Little Store Guy", value: '#0b7077' },
    { name: "Joe Blow Storage", value: '#34367c' },
  ]

  public displayedColumns: string[] = ['flag', 'Description', 'last_run'];
  public displayedColumnsDetails: string[] = ['Name', 'LastRun'];
  public selection = new SelectionModel(true, []); // For Grid selection
  // Bar chart 1
  public barChartOptions: ChartOptions = {
    responsive: true,
    backgroundColor: '#596bb3',
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#d13537', '#b000b5']
    }
  ]
  public barChartData: ChartDataset[] = [
    { data: [4, 4.5, 5, 6, 7, 5.5, 5, 4.5], label: 'Approved', type: 'line', backgroundColor: '#596bb3', hoverBackgroundColor: '#596bb3', borderColor: '#2a447b', borderCapStyle: 'round', pointBackgroundColor: '#ffffff', pointBorderColor: '#2a447b', pointHoverBorderColor: '#ffffff', pointHoverBackgroundColor: '#2a447b'},
    { data: [4, 4.5, 5, 6, 7, 5.5, 5, 4.5], label: 'Accepted', stack: 'a', backgroundColor: '#596bb3', hoverBackgroundColor: '#596bb3', borderColor: '#2a447b', borderCapStyle: 'round' },
  ];
  public barChartLabels: string[] = ['', '', '', '', '', '', ''];
// End Bar Chart 1

  constructor(private sharedService: SharedService,private savedSearchService :SavedSearchService,
    public router: Router) {
    Object.assign(this, { single });
    this.dataSource = new MatTableDataSource(APP_CONSTANTS.dataTable2);
    this.dataSourceDetails = new MatTableDataSource(APP_CONSTANTS.savedSearch);
  }

  // ngOnInit(): void {
  //   // this.getSavedSearchForDashboard();
  //   // this.sharedService.loadMasterData();
  // }

  /**
 * function to show click on pie chart
 * @params data - clicked object details
 */

  onSelect(data: any): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

    /**
 * function to show active element in pie chart
 * @params data - clicked object details
 */

  onActivate(data: any): void {
   // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  /**
 * function to show deactivate element in pie chart
 * @params data - clicked object details
 */

  onDeactivate(data: any): void {
   // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

 /**
 * function to show selected records array
 */

  logSelection() {
    // setTimeout(() => {
    //   console.log(this.selection?.['_selected']);
    // }, 100);
  }

  // Bar Chart 1 Events
  // public chartClicked({
  //   event,
  //   active,
  // }: {
  //   event: MouseEvent;
  //   active: {}[];
  // }): void {
  //   // console.log(event, active);
  // }
  // public chartHovered({
  //   event,
  //   active,
  // }: {
  //   event: MouseEvent;
  //   active: {}[];
  // }): void {
  // }
  // Bar chart Event 1 End

  getSavedSearchForDashboard(){
    this.savedSearchService.GetSavedSearchForDashboard().subscribe(data =>{
      this.savedSearchDataSource=data;
    });
  }

  onSavedSearchClick(selectedRow:SaveSearchModel){
    this.router.navigateByUrl(selectedRow.NavigateUrl, { state :selectedRow});
  }
}
