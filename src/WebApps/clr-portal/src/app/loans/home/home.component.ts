import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EventbusService } from "../../eventbus.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  numberPattern = /^[2-9][0-9]{11}$/;
  adharFormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(12),
    Validators.minLength(12),
  ]);
  aadharNumber: string;
  loading = false;
  printbtn:boolean=false;
 cleanform:boolean=false;
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private eventBus: EventbusService,
  ) {}
  numericOnly(event): boolean {
    let pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && event.charCode !== 0) {
      // If not a number, prevent the keypress
      event.preventDefault();
      return false;
    }
    return true;
  }
  

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
  
}
