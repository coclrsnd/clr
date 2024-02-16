import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { SearchDetailsComponent } from './search-details/search-details.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SearchDetailsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslateModule,
    NgxChartsModule,
    MaterialModule,
    SharedModule,
    NgChartsModule
  ]
})
export class DashboardModule { }
