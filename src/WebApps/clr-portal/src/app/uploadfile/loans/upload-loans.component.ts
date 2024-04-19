
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Organization } from '../../sign-up/model/organization';
import { SignupComponentStore } from '../../sign-up/signup.component.store';
import { startWith, tap } from 'rxjs/operators';
import { UploadFileRequest } from '../models/upload';
import { FileUploadService } from '../service/upload.service';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'upload-loans',
  templateUrl: 'upload-loans.component.html',
  styleUrl: 'upload-loans.component.css'
})

export class UploadLoansComponent implements OnInit {
  filteredOrganizations$: Observable<Organization[]>;
  selectedFile: File | undefined;
  progressValue: number = 0;
  progressBarVisible: boolean = false;
  progressmessage:string='';
  progressmsgcolor='black';
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
    this.progressBarVisible = true; // Show the progress bar
    this.progressValue = 0; // Reset progress when a new file is selected

    let uploadFileRequest: UploadFileRequest = {
      file: this.selectedFile,
      OrgCode: this.adharFormControl.value['code']
    }

    this.uploadService.uploadLoanFile(uploadFileRequest).subscribe(res => {
      console.log(res); 
      if (res.type === HttpEventType.UploadProgress) {
        this.progressValue = Math.round((100 * res.loaded) / res.total); // Calculate progress percentage
      } else if (res.type === HttpEventType.Response) {
        
        console.log(res.body); // Handle response from the server
      }
    },
  err=>{
    console.log(err);
    // this.progressBarVisible = false;
    this.progressmsgcolor='red';
    this.progressmessage="Upload failed";
    setTimeout(() => { // Add a delay to hide the progress bar
      this.progressBarVisible = false;
    }, 3000);
    
  }, () => {
    // Upload completed, hide the progress bar
    // this.progressBarVisible = false;
    this.progressValue = 100;
    this.progressmsgcolor='green';
    this.progressmessage="Upload success!";
    setTimeout(() => { // Add a delay to hide the progress bar
      this.progressBarVisible = false;
    }, 3000);
  }
)
  }

  onFileSelected($event: any) {
    this.selectedFile = $event.target.files[0];
    this.progressmessage='';
   
  }
 
}
