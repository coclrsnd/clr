import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  numberPattern = /^[1-9]\d{11}$/;
  adharFormControl = new FormControl("", [
    Validators.required,
    // Validators.pattern(this.numberPattern)
  ]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

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
