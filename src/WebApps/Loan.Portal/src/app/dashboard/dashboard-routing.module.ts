import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SearchDetailsComponent } from './search-details/search-details.component';

const routes: Routes = [{ path: '', component: DashboardComponent },
{ path: 'search', component: SearchDetailsComponent, data : { title: 'Saved Search', parent: 'Dashboard'} },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
