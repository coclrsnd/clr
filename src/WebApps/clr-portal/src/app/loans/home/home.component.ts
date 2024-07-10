import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EventbusService } from "../../eventbus.service";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { defaultDialogConfig } from "../shared/default-dialog-config";
import { LeadsformComponent } from "../leadsform/leadsform.component";
import { MatDialog } from "@angular/material/dialog";

export function adharOrVoterValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const adharPattern = /^[0-9]{12}$/;
    const voterPattern = /^[A-Z0-9]{10}$/; 
    if (!control.value) {
      return null; // consider empty value valid
    }
    const isValidAadhar = adharPattern.test(control.value);
    const isValidVoter = voterPattern.test(control.value);
    return isValidAadhar || isValidVoter ? null : { invalidNumber: 'Invalid Aadhaar or Voter ID' };
  };
}

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  numberPattern = /^[0-9]{12}$/;
  adharFormControl = new FormControl("", [Validators.required, adharOrVoterValidator()]);

  aadharNumber: string;
  voterId:string='';
  loading = false;
  printbtn:boolean=false;
 cleanform:boolean=false;
 private _adharNumber: string;
 private _leadadharnumber:string;
 private adharNumberSubject = new BehaviorSubject<string>(null);

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private eventBus: EventbusService, 
    private dialog: MatDialog,
  ) {}
  // numericOnly(event): boolean {
  //   let pattern = /[0-9]/;
  //   let inputChar = String.fromCharCode(event.charCode);
  //   if (!pattern.test(inputChar) && event.charCode !== 0) {
  //     // If not a number, prevent the keypress
  //     event.preventDefault();
  //     return false;
  //   }
  //   return true;
  // }
  // (keypress)="numericOnly($event)" 

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.adharFormControl.patchValue(param["adharNumber"]);
    });
  }

  onSubmit() {
    // this.aadharNumber = this.adharFormControl.value;
    if (this.adharFormControl.valid) {
      // this.cleanform=true;
      this.printbtn = false; 
      this.loading = true; 
      of(this.adharFormControl.value)
        .pipe(delay(2000)) 
        .subscribe(
          value => {
            // this.cleanform=false;
            this.aadharNumber = value;
            this.loading = false;
            this.printbtn=true;
            this.cdr.markForCheck(); 
          },
          error => {
            console.error('An error occurred', error);
            this.loading = false; 
            this.cdr.markForCheck(); 
          }
        );
        
    }

  }
 
  printTable(): void { 
    this.eventBus.sidenavClose.emit();
    setTimeout(() => {
      window.print();
    }, 0);
  }

  addlead() {
    const dialogConfig = defaultDialogConfig();
    dialogConfig.data = {
      dialogTitle: "Add Lead",
      loan: null,
      mode: "create",
    };

    this.dialog
      .open(LeadsformComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        this.adharNumberSubject.next(this._adharNumber);
      });
  }

  
}
