import { Component, Input, OnInit } from "@angular/core";
import { FormControl, ValidationErrors } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "error-tooltip",
  templateUrl: "error-tooltip.component.html",
  styleUrl: "error-tooltip.component.scss",
})
export class ErrorTooltipComponent implements OnInit {
  error: string[] = [];
  @Input()
  set errors(errs: ValidationErrors) {
    this.error = [];
    if (!errs) return;
    Object.keys(errs).forEach((key) => {
      switch (key) {
        case "required":
          this.error.push("Field is required");
          break;
        case "pattern":
          this.error.push("invalid value");
          break;
        case "minlength":
          this.error.push(
            `Min length is ${errs["minlength"]["requiredLength"]}`,
          );
          break;
        case "maxlength":
          this.error.push(
            `Max length is ${errs["maxlength"]["requiredLength"]}`,
          );
          break;
      }
    });
  }
  constructor() {}

  ngOnInit() {}
}
