import { NgModule } from '@angular/core'
import { DashboardComponent } from './dashboard.component'
import { AuthGuard } from '../login/gaurds/auth.guard'
import { LoansModule } from './loans/loans.module'
import { RouterModule } from '@angular/router'

const routs = [
  {
    path: 'loans',
    loadChildren: () =>
      import('./loans/loans.module').then((m) => m.LoansModule),
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [LoansModule, RouterModule.forChild(routs)],
  exports: [],
  declarations: [DashboardComponent],
  providers: [],
})
export class DashboardModule {}
