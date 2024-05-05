import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
    this.aadharNumber = this.adharFormControl.value;
  }
 
  printTable(): void {
    window.print(); // Open browser's print dialog
  }
}
