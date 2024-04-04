import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { LoanEntityService } from "./loan-entity.service";
import { filter, first, map, tap } from "rxjs/operators";

@Injectable()
export class LoansResolver {
  constructor(private loansService: LoanEntityService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const adharNumber = route.paramMap.get("adharNumber");
    return this.loansService.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.loansService.getWithAdhar(adharNumber);
        }
      }),
      filter((loaded) => !!loaded),
      first(),
    );
  }
}
