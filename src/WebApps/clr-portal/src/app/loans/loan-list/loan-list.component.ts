import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { defaultDialogConfig } from "../shared/default-dialog-config";
import { Loan } from "../model/loan";
import { LoanEntityService } from "../services/loan-entity.service";
import { User } from "../../auth/model/user.model";
import { AppState } from "../../reducers";
import { selectUserDetails } from "../../auth/auth.selectors";
import { MatTableDataSource } from "@angular/material/table";
import { EditLoanDialogComponent } from "../edit-course-dialog/edit-loan-dialog.component";
import { PrintingService } from "../services/printing.service";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from "../../material.module";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSort, Sort } from "@angular/material/sort";

@Component({
  selector: "loan-list",
  templateUrl: "./loan-list.component.html",
  styleUrls: ["./loan-list.component.css"],
})
export class LoanListComponent implements OnInit, OnDestroy {
  filterControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(12),
    Validators.minLength(12),
  ]);
  dataSource = new MatTableDataSource<Loan>();
  loading$: Observable<boolean>;
  errorMsg = '';
  displayedColumns: string[] = [
    "loanDate",
    "loanBorrower",
    "adharNumber",
    "organizationName",
    "loanType",
    "amount",
    "status",
    "actions",
  ];
  userDetails$: Observable<User>;
  showCurrentOrgsLoans: boolean = true;
  private adharNumberSubject = new BehaviorSubject<string>(null);
  private adharNumberSubscription: Subscription;
  private _adharNumber: string;
  errormsg:string='';
  constructor(
    private dialog: MatDialog,
    private loanService: LoanEntityService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private printingService: PrintingService,
    private _liveAnnouncer: LiveAnnouncer,
  ) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {
     if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  ngOnInit() {
    this.userDetails$ = this.store.pipe(select(selectUserDetails));
    this.adharNumberSubscription = this.adharNumberSubject
      .pipe(
        switchMap((adharNumber) => {
          if (adharNumber) {
            return this.loanService.getWithAdhar(adharNumber);
          } else {
            return this.store.pipe(
              select(selectUserDetails),
              switchMap((user) => {
                return this.loanService.getWithOrganization(
                  user.organizationCode,
                );
              }),
            );
          }
        }),
      )
      .subscribe((loans) => {
        this.dataSource.data = loans;
        this.dataSource.paginator=this.paginator;
      }
    );

  }

  ngOnDestroy() {
    if (this.adharNumberSubscription) {
      this.adharNumberSubscription.unsubscribe();
    }
  }

  @Input()
  set adharNumber(value: string) {
    this._adharNumber = value;
    this.adharNumberSubject.next(value);
  }


  editLoan(loan: Loan) {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: "Edit Loan",
      Loan: loan,
      mode: "update",
    };

    this.dialog
      .open(EditLoanDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        this.adharNumberSubject.next(this._adharNumber);
      });
  }

  addLoan() {
    const dialogConfig = defaultDialogConfig();
    dialogConfig.data = {
      dialogTitle: "Edit Loan",
      loan: null,
      mode: "create",
    };

    this.dialog
      .open(EditLoanDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        this.adharNumberSubject.next(this._adharNumber);
      });
  }

  onCheck(checked: boolean) {
    if (checked) {
      this.showCurrentOrgsLoans = true;
      this.adharNumberSubject.next(null); // Clear adharNumber to show current org's loans
    } else {
      this.showCurrentOrgsLoans = false;
      // this.displayedColumns.splice(this.displayedColumns.length - 2, 0, 'organizationName');
      if (this) this.adharNumberSubject.next(this._adharNumber);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
