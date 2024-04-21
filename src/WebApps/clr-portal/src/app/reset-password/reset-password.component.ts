import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ResetPasswordService } from "./reset.-password.service";
import { ResetPasswordRequestInput } from "./reset-password.model";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers";

@Component({
  selector: "reset-password",
  templateUrl: "reset-password.component.html",
  styleUrl: "reset-password.component.scss",
})
export class ResetPasswordComponent {

  resetForm: FormGroup;
  userMessage: string = '';

  constructor(private fb: FormBuilder, private resetPasswordService: ResetPasswordService, private store: Store<AppState>) {
    this.resetForm = this.fb.group({
      password: ["", Validators.required],
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  resetPassword() {
    let resetPasswordRequest: ResetPasswordRequestInput = this.resetForm.value;
    this.resetPasswordService.resetPassword(resetPasswordRequest).subscribe(response => {
      if (response) {
        this.userMessage = 'Password updated successfully';
      }
      else {
        this.userMessage = 'Error while updating password';
      }
    },error=>{
      this.userMessage = 'Error while updating password';
    })
  }
}
