import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  data : { title: 'Login'} },
  { path: 'sign-up', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), data : { title: 'Sign Up'} },
  { path: 'forgot-password', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), data : { title: 'Forgot Password'} },
  { path: 'reset-password', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), data : { title: 'Reset Password'} },
  { path: 'verify-email', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), data : { title: 'Verify Email'} },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), data : { title: 'Dashboard'} },
  {path: 'devfestfl', children: [
    {path: 'sessions', children: [
      {path: 'my-ally-cli', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'become-angular-tailer', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'material-design', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'what-up-web', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)}
    ]},
  ]},
  //{ path: 'contracts', loadChildren: () => import('./contracts/contracts.module').then(m => m.ContractsModule), data : { title: 'Contracts'} },
  // { path: 'rail-car', loadChildren: () => import('./rail-car/rail-car.module').then(m => m.RailCarModule), data : { title: 'Rail Car'} },
  // { path: 'vendors', loadChildren: () => import('./vendors/vendors.module').then(m => m.VendorsModule), data : { title: 'Vendors'} },
 //{ path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule), data : { title: 'Reports'} },
 //{ path: 'notification', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule), data : { title: 'Notification'} },
  // { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule), data : { title: 'Settings'} },
  // { path: 'help', loadChildren: () => import('./help/help.module').then(m => m.HelpModule), data : { title: 'Help'} },
  //{ path: 'user-settings', loadChildren: () => import('./user-settings/user-settings.module').then(m => m.UserSettingsModule), data : { title: 'User Profile'} },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), data : { title: 'Login'} },

  //{ path: 'on-board', loadChildren: () => import('./on-board/on-board.module').then(m => m.OnBoardModule), data : { title: 'On Board'} },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent, data : { title: 'Page Not Found'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
