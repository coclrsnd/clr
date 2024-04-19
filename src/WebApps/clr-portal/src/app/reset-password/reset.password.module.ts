import { NgModule } from "@angular/core";
import { ResetPasswordComponent } from "./reset-password.component";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
@NgModule({
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule.forChild([{ path: '', component: ResetPasswordComponent }])],
  exports: [],
  declarations: [ResetPasswordComponent],
  providers: [],
})
export class ResetPasswordModule { }
