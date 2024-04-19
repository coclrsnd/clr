import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "reset-password",
  templateUrl: "reset-password.component.html",
  styleUrl: "reset-password.component.scss",
})
export class ResetPasswordComponent implements OnInit {
  onSave() {
    throw new Error("Method not implemented.");
  }
  resetForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  ngOnInit() {}
}
