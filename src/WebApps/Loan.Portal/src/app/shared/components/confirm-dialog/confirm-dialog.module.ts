import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog.service';
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        DragDropModule
    ],
    declarations: [
        ConfirmDialogComponent
    ],
    exports: [ConfirmDialogComponent],
    providers: [ConfirmDialogService]
})
  export class ConfirmDialogModule {
  }
