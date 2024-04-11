
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Organization } from '../../sign-up/model/organization';
import { SignupComponentStore } from '../../sign-up/signup.component.store';
import { startWith, tap } from 'rxjs/operators';
import { UploadFileRequest } from '../models/upload';
import { FileUploadService } from '../service/upload.service';

@Component({
  selector: 'upload-loans',
  templateUrl: 'upload-loans.component.html',
  styleUrl: 'upload-loans.component.css'
})

export class UploadLoansComponent implements OnInit {
  filteredOrganizations$: Observable<Organization[]>;
  selectedFile: any;
  adharFormControl = new FormControl("", [
    Validators.required,
  ]);
  constructor(private signupStore: SignupComponentStore, private uploadService: FileUploadService) { }

  ngOnInit() {
    this.filteredOrganizations$ = this.signupStore.filteredOrganizations$;
    this.adharFormControl
      .valueChanges.pipe(
        startWith(""),
        tap((value) => this.signupStore.filterOrganizations(value)),
      )
      .subscribe();
  }

  displayOrganizationFn(organization?: any): string | undefined {
    return organization ? organization.name : undefined;
  }

  onSubmit() {
    console.log(this.adharFormControl.value)
    let uploadFileRequest: UploadFileRequest = {
      file: this.selectedFile,
      OrgCode: this.adharFormControl.value['code']
    }

    this.uploadService.uploadLoanFile(uploadFileRequest).subscribe(res => {
      console.log(res);
    },
  err=>{
    console.log(err)
  })
  }

  onFileSelected($event: any) {
    this.selectedFile = $event.target.files[0];
  }
}
