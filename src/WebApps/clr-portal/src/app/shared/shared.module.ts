import { NgModule } from "@angular/core";
import { ErrorTooltipComponent } from "./components/error-tooltip.component";
import { MaterialModule } from "../material.module";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "./components/loader/loader.component";

@NgModule({
  imports: [CommonModule, MaterialModule],
  exports: [ErrorTooltipComponent, LoaderComponent],
  declarations: [ErrorTooltipComponent, LoaderComponent],
  providers: [],
})
export class SharedModule {}
