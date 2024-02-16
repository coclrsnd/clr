import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from './user-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { ChangepasswordDialogComponent } from './changepassword-dialog/changepassword-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    UserSettingsComponent,
    ChangepasswordDialogComponent
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    DragDropModule,
    MatTooltipModule
  ]
})
export class UserSettingsModule { }
