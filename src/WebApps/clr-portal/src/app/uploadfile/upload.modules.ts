import { NgModule } from '@angular/core';

import { UploadLoansComponent } from './loans/upload-loans.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponentStore } from '../sign-up/signup.component.store';
import { CommonModule } from '@angular/common';
import { FileUploadService } from './service/upload.service';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: UploadLoansComponent }]),
  ],
  exports: [],
  declarations: [UploadLoansComponent],
  providers: [SignupComponentStore,FileUploadService],
})
export class UploadModule { }