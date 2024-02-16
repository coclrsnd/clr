// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { Directive, Injectable, OnDestroy } from '@angular/core';
@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class Base implements OnDestroy {
  protected componentDestroyed$: Subject<any>;
  constructor() {
    this.componentDestroyed$ = new Subject<void>();
    const destroyFunc = this.ngOnDestroy;
    this.ngOnDestroy = () => {
      destroyFunc.bind(this)();
      this.componentDestroyed$.next([]);
      this.componentDestroyed$.complete();
    };
  }
  // placeholder of ngOnDestroy. no need to do super() call of extended class.
  public ngOnDestroy() {

  }
}
