import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-loan-dialog',
  templateUrl: 'loan-dialog.component.html',
  styleUrl: 'loan-dialog.component.scss',
})
export class LoanDialogComponent implements OnInit {
  loanForm: FormGroup

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loanForm = this.formBuilder.group({
      amount: ['', Validators.required],
      status: ['', Validators.required],
      organizationCode: ['', Validators.required],
      adharNumber: ['', Validators.required],
      loanDate: ['', Validators.required],
      loanBorrower: ['', Validators.required],
      loanType: ['', Validators.required],
    })
  }

  onSubmit() {
    if (this.loanForm.valid) {
      // Handle form submission
      console.log(this.loanForm.value)
    } else {
      // Form is invalid, display validation errors
      console.log('Form is invalid')
    }
  }
}
