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
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { EditLoanDialogComponent } from "../edit-loan-dialog/edit-loan-dialog.component";
import { PrintingService } from "../services/printing.service";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../material.module";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSort, Sort } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { NgZone } from "@angular/core";
import * as moment from "moment";
import { NgModule } from "@angular/core";
import {
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { LoansModule } from "../loans.module";
import { ToastrService } from "ngx-toastr";
import { MatSelectChange } from "@angular/material/select";
import { MaskAadharPipe } from "../../mask-aadhar.pipe";
interface TableColumn {
  key: string;
  displayName: string;
}

@Component({
  selector: "loan-list",
  templateUrl: "./loan-list.component.html",
  styleUrls: ["./loan-list.component.css"],
  animations: [
    trigger("expandCollapse", [
      state("collapsed", style({ height: "0px", overflow: "scroll" })),
      state("expanded", style({ height: "*" })),
      transition("collapsed <=> expanded", animate("300ms ease-out")),
    ]),
  ],
})
export class LoanListComponent implements OnInit, OnDestroy {
  filterControl = new FormControl("", [
    Validators.required,
    Validators.pattern(/^[0-9]{12}$/),
  ]);
  isHidden: boolean = true;
  dataSource = new MatTableDataSource<Loan>();
  loading$: Observable<boolean>;
  errorMsg = "";
  fromDate = new FormControl("");
  toDate = new FormControl("");
  displayedColumns: string[] = [
    "loanDate",
    "loanBorrower",
    "adharNumber",
    "organizationName",
    "loanType",
    "amount",
    "status",
    "repaymentStatus",
    "suretyholder1",
    "suretyholder1Adhar",
    "suretyholder2",
    "suretyholder2Adhar",
    "voterId",
    "panCardNumber",
    "actions",
  ];
  userDetails$: Observable<User>;
  showCurrentOrgsLoans: boolean = true;
  private adharNumberSubject = new BehaviorSubject<string>(null);
  private adharNumberSubscription: Subscription;
  private _adharNumber: string;
  errormsg: string = "";
  selectedLoan: Loan | null = null;
  currentDate = new Date();

  defaultColumns: string[] = [
    "loanDate",
    "loanBorrower",
    "adharNumber",
    
    "loanType",
    "amount",
    "status",
    "repaymentStatus",
    "actions",
  ];
  columns = new FormControl([]);
  columnsList: TableColumn[] = [
    { key: "loanDate", displayName: "Loan Date" },
    { key: "loanBorrower", displayName: "Borrower" },
    { key: "adharNumber", displayName: "Adhar Number" },
    { key: "organizationName", displayName: "Organization" },
    { key: "loanType", displayName: "Loan Type" },
    { key: "amount", displayName: "Amount" },
    { key: "status", displayName: "Status" },
    { key: "repaymentStatus", displayName: "Repayment Status" },
    { key: "suretyholder1", displayName: "1st Surety" },
    { key: "suretyholder1Adhar", displayName: "1st Surety Adhar" },
    { key: "suretyholder2", displayName: "2nd Surety" },
    { key: "suretyholder2Adhar", displayName: "2nd Surety Adhar" },
    { key: "voterId", displayName: "Voter Id" },
    { key: "panCardNumber", displayName: "Pancard Number" },
    { key: "actions", displayName: "Actions" },
  ];
  // displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];

  constructor(
    private dialog: MatDialog,
    private loanService: LoanEntityService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private printingService: PrintingService,
    private _liveAnnouncer: LiveAnnouncer,
    private ngZone: NgZone,
    private toastr: ToastrService,
  ) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // Set default sort
    this.sort.active = "loanDate";
    this.sort.direction = "desc";
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
  ngOnInit() {
    this.columns.setValue(this.defaultColumns); // Set default columns on load
    this.updateDisplayedColumns();

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
        this.selectedLoan = loans && loans.length > 0 ? loans[0] : null;
        this.dataSource.paginator = this.paginator;
      });
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
    // LoanListComponent.dialog: MatDialog
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
      this.adharNumberSubject.next(null);
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
  panelState: "expanded" | "collapsed" = "collapsed";

  togglePanel() {
    this.panelState = this.panelState === "expanded" ? "collapsed" : "expanded";
  }

  toggleVisibility() {
    this.isHidden = !this.isHidden;
  }
  toastrclick() {
    this.toastr.success("add successfully", "Success");
  }

  getStatusClass(status: any) {
    switch (status) {
      case "Active":
        return "active dotgreen";

      case "In-Active":
        return "inactive";
      case "In-active":
        return "inactive";
      case "Closed":
        return "closed";
      case "OTS":
        return "ots";
      default:
        return "";
    }
  }
  hoverStates: { [key: string]: boolean } = {};

  setHoverState(elementId: string, state: boolean) {
    this.hoverStates[elementId] = state;
  }

  isHovering(elementId: string): boolean {
    return !!this.hoverStates[elementId]; // Ensure undefined states are treated as false
  }

  selectedColumnsDisplay(): string {
    // Filter out default columns from the display
    const userSelectedColumns = this.columns.value.filter(
      (col) => !this.defaultColumns.includes(col),
    );
    return userSelectedColumns.length > 0
      ? this.columnsList
          .filter((col) => userSelectedColumns.includes(col.key))
          .map((col) => col.displayName)
          .join(", ")
      : "Select columns";
  }

  addColumn(event: MatSelectChange): void {
    // Update FormControl to include only selected columns that are not default
    this.columns.setValue([
      ...this.defaultColumns,
      ...event.value.filter((col) => !this.defaultColumns.includes(col)),
    ]);
    this.updateDisplayedColumns();
    this.table.renderRows(); // Refresh the table to show changes
  }

  updateDisplayedColumns(): void {
    // Initialize an array to hold the current state of selected columns.
    let updatedColumns = [];

    // Loop through the predefined order of columns.
    this.displayedColumns.forEach((column) => {
      // Check if the column is included in the FormControl value (i.e., it has been selected by the user or is a default column).
      if (this.columns.value.includes(column)) {
        updatedColumns.push(column); // Add it to the updatedColumns array in the correct order.
      }
    });

    // Update the columnsToDisplay with the correctly ordered columns.
    this.columnsToDisplay = updatedColumns;
  }
}
