import { ModuleWithProviders, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SignupComponent } from "./signup.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SignupService } from "./services/signup.service";

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: "", component: SignupComponent }]),
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  providers: [SignupService],
})
export class SignupModule {}
