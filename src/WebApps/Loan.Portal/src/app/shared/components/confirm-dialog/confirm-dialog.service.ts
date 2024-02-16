import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConfirmDialogComponent } from './confirm-dialog.component';
@Injectable()
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<ConfirmDialogComponent>;


  /** To open dilogue
   * @method open
   * @param options - initial setup
   */
  public open(options): void {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
         data: {
           title: options.title,
           message: options.message,
           cancelText: options.cancelText,
           confirmText: options.confirmText,
           reverseBtn: options.reverseBtn
         }
    });
  }


  /** To confirm when dilogue is opened
   * @method confirmed
   * @returns observable - true or false based on response
   */
  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
        return res;
      }
    ));
  }
}
