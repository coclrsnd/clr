import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { LoanListComponent } from "./loan-list/loan-list.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Routes } from "@angular/router";
import {
  EntityDataService,
  EntityDefinitionService,
  EntityMetadataMap,
} from "@ngrx/data";
import { LoanEntityService } from "./services/loan-entity.service";
import { LoansDataService } from "./services/loan-data.service";
import { EditLoanDialogComponent } from "./edit-course-dialog/edit-loan-dialog.component";
import { LoansResolver } from "./services/loan.resolver";
import { SharedModule } from "../shared/shared.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import { MaterialModule } from "../material.module";


export const loansRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "loans",
  },
  {
    path: "loans",
    component: HomeComponent,
    children: [
      {
        path: ":adharNumber",
        component: LoanListComponent,
      },
    ],
  },
];

const entityMetadata: EntityMetadataMap = {
  Loan: {},
};

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    SharedModule,
    RouterModule.forChild(loansRoutes),
    MatGridListModule,
    MaterialModule,
  ],
  declarations: [HomeComponent, LoanListComponent, EditLoanDialogComponent],
  exports: [HomeComponent, LoanListComponent, EditLoanDialogComponent],
  providers: [LoanEntityService, LoansDataService, LoansResolver],
})
export class LoansModule {
  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private loanDataService: LoansDataService,
  ) {
    eds.registerMetadataMap(entityMetadata);
    entityDataService.registerService("Loan", loanDataService);
  }
}
