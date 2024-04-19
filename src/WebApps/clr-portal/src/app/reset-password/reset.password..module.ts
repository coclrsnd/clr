import { NgModule } from '@angular/core';
import { ResetPasswordComponent } from './reset-password.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
@NgModule({
  imports: [CommonModule,MaterialModule],
  exports: [],
  declarations: [ResetPasswordComponent],
  providers: [],
})
export class ResetPasswordModule { }
