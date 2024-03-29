import { NgModule } from '@angular/core'

import { LoansComponent } from './loans.component'
import { RouterModule } from '@angular/router'
import { LoanDialogComponent } from './loan-dialog/loan-dialog.component'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatNativeDateModule } from '@angular/material/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatTableModule } from '@angular/material/table'

@NgModule({
  imports: [
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild([{ path: 'add', component: LoanDialogComponent }]),
  ],
  exports: [],
  declarations: [LoanDialogComponent],
  providers: [],
})
export class LoansModule {}
