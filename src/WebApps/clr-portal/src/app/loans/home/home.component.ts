import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { EventbusService } from "../../eventbus.service";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { defaultDialogConfig } from "../shared/default-dialog-config";
import { LeadsformComponent } from "../leadsform/leadsform.component";
import { MatDialog } from "@angular/material/dialog";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Renderer2, ElementRef } from '@angular/core';

export function adharOrVoterValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const adharPattern = /^[0-9]{12}$/;
    const voterPattern = /^[A-Z0-9]{10}$/;
    if (!control.value) {
      return null; // consider empty value valid
    }
    const isValidAadhar = adharPattern.test(control.value);
    const isValidVoter = voterPattern.test(control.value);
    return isValidAadhar || isValidVoter
      ? null
      : { invalidNumber: "Invalid Aadhaar or Voter ID" };
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
  adharFormControl = new FormControl("", [
    Validators.required,
    adharOrVoterValidator(),
  ]);

  adharNumber: string;
  voterId: string = "";
  loading = false;
  printbtn: boolean = false;
  cleanform: boolean = false;
  private _adharNumber: string;
  private _leadadharnumber: string;
  private adharNumberSubject = new BehaviorSubject<string>(null);

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private eventBus: EventbusService,
    private dialog: MatDialog,
    private renderer: Renderer2, private el: ElementRef,
  ) { }
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
          (value) => {
            // this.cleanform=false;
            this.adharNumber = value;
            this.loading = false;
            this.printbtn = true;
            this.cdr.markForCheck();
          },
          (error) => {
            console.error("An error occurred", error);
            this.loading = false;
            this.cdr.markForCheck();
          },
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


  hideIconsForPrinting() {
    const icons = this.el.nativeElement.querySelectorAll('.mat-icon-button.eyeclass, .mat-icon-button.eyeclass mat-icon');
    icons.forEach(icon => {
      this.renderer.setStyle(icon, 'display', 'none');
    });

    setTimeout(() => {
      window.print();
      icons.forEach(icon => {
        this.renderer.removeStyle(icon, 'display');
      });
    }, 300);
  }

  exportloans(): void {
    const dataElement = document.getElementById('excelloans');
    if (!dataElement) return; // Exit if no element found

    // Clone the original data element to manipulate for export
    const clonedElement = dataElement.cloneNode(true) as HTMLElement;

    // Find all icons in the cloned element and remove them
    clonedElement.querySelectorAll('.mat-icon-button.eyeclass, .visible, .action').forEach(icon => {
      icon.remove();
    });

    // Proceed with exporting the cloned table to Excel
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(clonedElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LOANS');

    // Define column widths for the sheet (optional)
    ws['!cols'] = [
      { wch: 15 }, // Example width settings
      { wch: 20 },
      { wch: 15 },
      { wch: 50 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 }
    ];

    // Save the workbook to a file
    XLSX.writeFile(wb, 'LoansSheet.xlsx');
  }

  exportleads(): void {
    const dataElement = document.getElementById('excelleads');
    if (!dataElement) {
      return; // Exit if no element found
    }

    // Clone the original data element to manipulate for export
    const clonedElement = dataElement.cloneNode(true) as HTMLElement;

    // Find all icons in the cloned element and remove them
    const icons = clonedElement.querySelectorAll('.mat-icon-button.eyeclass, .visible, .action');

    icons.forEach(icon => {
      icon.remove();
    });

    // Proceed with exporting the cloned table to Excel
    const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(clonedElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws2, 'LEADS');

    // Optional: Define column widths for the first sheet (if needed)
    ws2['!cols'] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 50 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 }
    ];

    // Save the workbook to a file
    XLSX.writeFile(wb, 'LeadsSheet.xlsx');
    console.log('Excel file should have been written.');
  }
}
