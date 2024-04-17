import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { Organization } from "../../sign-up/model/organization";
import { SignupComponentStore } from "../../sign-up/signup.component.store";
import { startWith, tap } from "rxjs/operators";
import { UploadFileRequest } from "../models/upload";
import { FileUploadService } from "../service/upload.service";
import { UploadStore } from "./upload-loans.store";

@Component({
  selector: "upload-loans",
  templateUrl: "upload-loans.component.html",
  styleUrl: "upload-loans.component.css",
})
export class UploadLoansComponent implements OnInit {
  filteredOrganizations$: Observable<Organization[]>;
  selectedFile: any;
  organization = new FormControl("", [Validators.required]);
  uploadStatus$: Observable<boolean> = undefined;
  constructor(
    private signupStore: SignupComponentStore,
    private uploadStore: UploadStore,
  ) {
    this.uploadStatus$ = this.uploadStore.uploadStatus$;
  }

  ngOnInit() {
    this.filteredOrganizations$ = this.signupStore.filteredOrganizations$;
    this.organization.valueChanges
      .pipe(
        startWith(""),
        tap((value) => this.signupStore.filterOrganizations(value)),
      )
      .subscribe();
  }

  displayOrganizationFn(organization?: any): string | undefined {
    return organization ? organization.name : undefined;
  }

  onSubmit() {
    console.log(this.organization.value);
    let uploadFileRequest: UploadFileRequest = {
      file: this.selectedFile,
      OrgCode: this.organization.value["code"],
    };
    this.uploadStore.upload(uploadFileRequest);
  }

  onFileSelected($event: any) {
    this.selectedFile = $event.target.files[0];
  }
}
