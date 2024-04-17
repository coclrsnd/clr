import { NgModule } from "@angular/core";
import { ErrorTooltipComponent } from "./components/error-tooltip.component";
import { MaterialModule } from "../material.module";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [CommonModule, MaterialModule],
  exports: [ErrorTooltipComponent],
  declarations: [ErrorTooltipComponent],
  providers: [],
})
export class SharedModule {}
