import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  numberPattern = (/^(?!0{12})[0-9]{12}$/);
  adharFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.numberPattern)
  ]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private changeDR:ChangeDetectorRef
  ) {}
  refreshView() {
    // Trigger change detection manually
    this.changeDR.detectChanges();
  }
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.adharFormControl.patchValue(param["adharNumber"]);
    });
  }

  onSubmit() {
    this.router.navigate([this.adharFormControl.value], {
      relativeTo: this.route,
     
    });  

    
  }
}
