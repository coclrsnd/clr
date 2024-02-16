import { ChangeDetectionStrategy, Component, HostListener, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
changeDetection: ChangeDetectionStrategy.OnPush,
selector: 'app-confirm-dialog',
templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { cancelText: string, confirmText: string, message: string, title: string, reverseBtn: boolean }, private mdDialogRef: MatDialogRef<ConfirmDialogComponent>) { }


  /** To trigger when cancelled on opened dilogue
   * @method cancel
   */
  public cancel(): void {
    this.close(false);
  }

   /** To close opened dilogue
   * @method close
   * @param value - boolean true or false;
   */
  public close(value): void {
    this.mdDialogRef.close(value);
  }

  /** To confirm and close opened dilogue
   * @method confirm
   */
  public confirm(): void {
    this.close(true);
  }

    /** To operate when esc key is pressed
   * @method HostListener
   * @param keydown.esc - when esc is pressed close dilogue
   */
  @HostListener("keydown.esc")
  public onEsc() {
    this.close(false);
  }
}
