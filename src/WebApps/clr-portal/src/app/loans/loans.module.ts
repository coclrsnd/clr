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
import { EditLoanDialogComponent } from "./edit-loan-dialog/edit-loan-dialog.component";
import { LoansResolver } from "./services/loan.resolver";
import { SharedModule } from "../shared/shared.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import { MaterialModule } from "../material.module";
import { MaskAadharPipe } from "../mask-aadhar.pipe";
import { LeadslistComponent } from "./leadslist/leadslist.component";
import { LeadsformComponent } from "./leadsform/leadsform.component";
import { LoanLeadEntityService } from "./services/loanleads-entity.service";
import { LoanLeadDataService } from "./services/loanleads-data.service";
import { Loan } from "./model/loan";
import { LoanLead } from "./model/loanlead";

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
      {
        path: "leadadharnumber",
        component: LeadslistComponent,
      },
    ],
  },
];

const entityMetadata: EntityMetadataMap = {
  Loan: {
    selectId: (loan: Loan) => loan.id,
    entityDispatcherOptions: {
      optimisticAdd: true
    }
  },
  LoanLead: {
    selectId: (loanLead: LoanLead) => loanLead.id,
    entityDispatcherOptions: {
      optimisticAdd: true
    }
  },
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
    MatProgressSpinnerModule,
    MaskAadharPipe,
  ],
  declarations: [
    HomeComponent,
    LoanListComponent,
    EditLoanDialogComponent,
    LeadslistComponent,
    LeadsformComponent,
    LeadslistComponent,
  ],
  exports: [
    HomeComponent,
    LoanListComponent,
    EditLoanDialogComponent,
    LeadslistComponent,
  ],
  providers: [
    LoanEntityService,
    LoansDataService,
    LoansResolver,
    LoanLeadEntityService,
    LoanLeadDataService,
  ],
})
export class LoansModule {
  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private loanDataService: LoansDataService,
    private loanLeadDataService: LoanLeadDataService,
  ) {
    eds.registerMetadataMap(entityMetadata);
    entityDataService.registerService("Loan", loanDataService);
    entityDataService.registerService("LoanLead", loanLeadDataService);
  }
}
