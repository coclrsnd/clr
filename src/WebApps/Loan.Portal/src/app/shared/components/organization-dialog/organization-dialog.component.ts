import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONSTANTS } from 'src/app/app-constants';
import { MasterDataService } from 'src/app/services/master-data.service';
import { OrganizationModel } from '../../models/organization-model.model';

@Component({
  selector: 'app-organization-dialog',
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.scss'],
})
export class OrganizationDialogComponent implements OnInit {
  public OrganizationForm: UntypedFormGroup;
  public isOrganizationSaveRequestRaised: boolean = false;

  public organizationModel: OrganizationModel;
  isAlreadyExist: boolean = false;
  public pageTitle: string = 'Organization';

  constructor(
    public formBuilder: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    public translateService: TranslateService,
    public dialogRef: MatDialogRef<OrganizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeOrganizationForm();
    this.pageTitle=this.data.title;
  }

  /** Initialize on-board customer form
   * @method initializeOrganizationForm
   */
  public initializeOrganizationForm(): void {
    this.OrganizationForm = this.formBuilder.group({
      Name: [this.data.orgName, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9-&. ]*$/)]],
      Description: [APP_CONSTANTS.emptyString],
    });
  }

  /** Get Current form-control
   * @method getOrganizationFormControl
   */
  get getOrganizationFormControl() {
    return this.OrganizationForm.controls;
  }

  /** On click on submit/save organization
   * @method onSubmitOrganizationForm
   */
  public onSubmitOrganizationForm(): void {
    this.isOrganizationSaveRequestRaised = true;
    this.isAlreadyExist = false;
    if (this.OrganizationForm.invalid) {
      return;
    }

    this.organizationModel = Object.assign(this.OrganizationForm.getRawValue());

    this.masterDataService
      .SaveAndGetOrganization(this.organizationModel)
      .subscribe((result) => {
        this.organizationModel = result;
        this.isAlreadyExist = false;
        if (result != null && result.Id == 0) {
          this.isAlreadyExist = true;
        }
        this.submitForm();
      });
  }

  public submitForm(): void {
    if (!this.isAlreadyExist) {
      this.onClosePopup();
    }
  }
  /** on reset form
   * @method onReset
   */
  public onReset(): void {
    this.isOrganizationSaveRequestRaised = false;
    this.OrganizationForm.reset();
  }

  /** on reset form
   * @method onClosePopup
   */
  public onClosePopup(): void {
    this.onReset();
    this.dialogRef.close(this.organizationModel);
  }
}
