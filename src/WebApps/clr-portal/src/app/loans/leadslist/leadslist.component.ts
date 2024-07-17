import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { defaultDialogConfig } from "../shared/default-dialog-config";
// import { Loan } from "../model/loan";
// import { LoanEntityService } from "../services/loan-entity.service";
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
import { LoanLead } from "../model/loanlead";
import { LoanLeadEntityService } from "../services/loanleads-entity.service";
import { LeadsformComponent } from "../leadsform/leadsform.component";

@Component({
  selector: "leadslist",
  templateUrl: "./leadslist.component.html",
  styleUrl: "./leadslist.component.css",
  animations: [
    trigger("expandCollapse", [
      state("collapsed", style({ height: "0px", overflow: "scroll" })),
      state("expanded", style({ height: "*" })),
      transition("collapsed <=> expanded", animate("300ms ease-out")),
    ]),
  ],
})
export class LeadslistComponent implements OnInit, OnDestroy {
  isHidden: boolean = true;
  dataSource = new MatTableDataSource<LoanLead>();
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
    "actions",
  ];
  userDetails$: Observable<User>;
  showCurrentOrgsLeads: boolean = true;
  private adharNumberSubject = new BehaviorSubject<string>(null);
  private _adharNumber: string;
  errormsg: string = "";
  selectedLead: LoanLead | null = null;
  currentDate = new Date();
  columns = new FormControl([]);
  columnsToDisplay: string[] = [];
  private subscriptions = new Subscription();
  private adharNumberSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private loanleadService: LoanLeadEntityService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private printingService: PrintingService,
    private _liveAnnouncer: LiveAnnouncer,
    private ngZone: NgZone,
    private toastr: ToastrService,
  ) {
    this.columnsToDisplay = this.displayedColumns;
  }

  @ViewChild(MatSort) sort: MatSort;
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
    this.userDetails$ = this.store.pipe(select(selectUserDetails));
    this.adharNumberSubscription = this.adharNumberSubject
    .pipe(
      switchMap((adharNumber) => {
        if (adharNumber) {
          return this.loanleadService.getWithAdhar(adharNumber);
        } else {
          return this.store.pipe(
            select(selectUserDetails),
            switchMap((user) => {
              return this.loanleadService.getWithOrganization(
                user.organizationCode,
              );
            }),
          );
        }
      }),
    )
    .subscribe((loans) => {
      this.dataSource.data = loans;
    });

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.adharNumberSubscription.unsubscribe();
  }

  @Input()
  set adharNumber(value: string) {
    this._adharNumber = value;
    this.adharNumberSubject.next(value);
  }

  editLoan(loanlead: LoanLead) {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: "Edit LoanLead",
      LoanLead: loanlead,
      mode: "update",
    };

    this.dialog
    .open(LeadsformComponent, dialogConfig)
    .afterClosed()
    .subscribe((response) => {
      this.adharNumberSubject.next(this._adharNumber);
    });
  }

  addLoan() {
    const dialogConfig = defaultDialogConfig();
    dialogConfig.data = {
      dialogTitle: "Add LoanLead",
      loanlead: null,
      mode: "create",
    };
    // LoanListComponent.dialog: MatDialog
    this.dialog
      .open(LeadsformComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        this.adharNumberSubject.next(this._adharNumber);
      });
  }

  // onCheck(checked: boolean) {
  //   if (checked) {
  //     this.showCurrentOrgsLeads = true;
  //     this.adharNumberSubject.next(null);
  //   } else {
  //     this.showCurrentOrgsLeads = false;

  //     if (this) this.adharNumberSubject.next(this._adharNumber);
  //   }
  // }

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
}
