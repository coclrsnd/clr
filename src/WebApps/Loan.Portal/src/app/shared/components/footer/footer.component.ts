import { AppModule } from '../../../app.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @ViewChild('menuTrigger', { static: false}) menuTrigger: MatMenuTrigger;
  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogFromMenuExampleDialog, {restoreFocus: false});
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

}

@Component({
  selector: 'dialog-from-menu-dialog',
  template: `
  `,
})
export class DialogFromMenuExampleDialog {
}

